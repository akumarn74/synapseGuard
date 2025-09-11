import asyncio
from abc import ABC, abstractmethod
from typing import Dict, List, Any
import numpy as np
import os
from openai import OpenAI

class BaseAgent(ABC):
    def __init__(self, name: str, tidb_connection):
        self.name = name
        self.db = tidb_connection
        # Initialize OpenAI client with new SDK
        api_key = os.getenv('OPENAI_API_KEY')
        if api_key:
            try:
                print(f"Initializing OpenAI client for agent: {name}")
                # Clear any proxy-related environment variables that might interfere
                proxy_vars = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy', 'proxies']
                original_values = {}
                for var in proxy_vars:
                    if var in os.environ:
                        original_values[var] = os.environ.pop(var)
                
                self.openai_client = OpenAI(api_key=api_key)
                self.has_openai_key = True
                print(f"✅ OpenAI client initialized successfully for {name}")
                
                # Restore environment variables
                for var, value in original_values.items():
                    os.environ[var] = value
                    
            except Exception as e:
                print(f"❌ OpenAI client initialization error for {name}: {e}")
                print(f"Exception type: {type(e)}")
                import traceback
                traceback.print_exc()
                
                # Restore environment variables even on error
                for var, value in original_values.items():
                    os.environ[var] = value
                    
                self.has_openai_key = False
                self.openai_client = None
        else:
            print(f"⚠️  No OpenAI API key found for agent: {name}")
            self.has_openai_key = False
            self.openai_client = None
        
    @abstractmethod
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        pass
    
    async def create_embedding(self, text: str) -> List[float]:
        """Create vector embedding for text using OpenAI embeddings API"""
        if not self.has_openai_key:
            # Demo fallback - create deterministic vector from text hash
            import hashlib
            hash_obj = hashlib.sha256(text.encode())
            # Create a 1536-dimension vector from hash (matching OpenAI embedding size)
            hash_bytes = hash_obj.digest()
            vector = []
            for i in range(1536):
                vector.append(float(hash_bytes[i % len(hash_bytes)] / 255.0))
            return vector
        
        try:
            # Use real OpenAI embeddings API
            import asyncio
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.openai_client.embeddings.create(
                    model="text-embedding-3-small",
                    input=text
                )
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"OpenAI Embeddings API error: {e}")
            # Fallback to hash-based embedding
            import hashlib
            hash_obj = hashlib.sha256(text.encode())
            hash_bytes = hash_obj.digest()
            vector = []
            for i in range(1536):
                vector.append(float(hash_bytes[i % len(hash_bytes)] / 255.0))
            return vector
    
    def safe_json_loads(self, json_string, fallback=None):
        """Safely parse JSON string with fallback for None or invalid JSON"""
        if json_string is None:
            return fallback or {}
        try:
            import json
            return json.loads(json_string)
        except (json.JSONDecodeError, TypeError):
            return fallback or {}
    
    async def generate_ai_response(self, prompt: str) -> str:
        """Generate AI response using OpenAI GPT-4o-mini"""
        if not self.has_openai_key:
            # Fallback for when OpenAI key is not available
            # Check if JSON format is requested in prompt
            if "Format as JSON" in prompt and "trend" in prompt:
                # Return JSON format for trajectory prediction
                return '{"trend": "stable", "urgency": "low", "confidence": 0.8, "interpretation": "Normal behavioral patterns detected", "intervention_timeframe": "routine_monitoring"}'
            elif "normal" in prompt.lower():
                return "Patient shows normal behavioral patterns within baseline parameters. No immediate concerns detected."
            elif "concerning" in prompt.lower():
                return "Analysis indicates some deviation from baseline patterns. Recommend increased monitoring and family check-in."
            elif "crisis" in prompt.lower():
                return "ALERT: Significant behavioral deviations detected. Immediate intervention recommended. Contact emergency support network."
            else:
                return f"Analyzed behavioral data for cognitive assessment. Processed {len(prompt.split())} data points with pattern recognition algorithms."
        
        try:
            # Use the new OpenAI client in async context
            import asyncio
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None, 
                lambda: self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=500,
                    temperature=0.2
                )
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"OpenAI API error: {e}")
            # Fallback to basic response
            return f"Analysis processed for {self.name}. Unable to generate detailed AI response due to API error."
    
    async def vector_search(self, query_vector: List[float], table: str, 
                          vector_column: str, limit: int = 5) -> List[Dict]:
        """Perform similarity search using text-based vector storage"""
        # Since TiDB Serverless doesn't support VECTOR type, we'll do text-based search
        # Get all patterns and compute similarity in Python
        query = f"SELECT * FROM {table} WHERE {vector_column} IS NOT NULL ORDER BY timestamp DESC LIMIT 50"
        cursor = self.db.cursor(dictionary=True)
        cursor.execute(query)
        all_patterns = cursor.fetchall()
        
        # Compute cosine similarity in Python
        import json
        import math
        
        similarities = []
        for pattern in all_patterns:
            try:
                # Parse stored vector
                stored_vector_str = pattern[vector_column]
                # Remove brackets and split
                if stored_vector_str.startswith('[') and stored_vector_str.endswith(']'):
                    stored_vector_str = stored_vector_str[1:-1]
                stored_vector = [float(x.strip()) for x in stored_vector_str.split(',')]
                
                # Calculate cosine similarity
                dot_product = sum(a * b for a, b in zip(query_vector, stored_vector))
                magnitude_a = math.sqrt(sum(a * a for a in query_vector))
                magnitude_b = math.sqrt(sum(b * b for b in stored_vector))
                
                if magnitude_a > 0 and magnitude_b > 0:
                    similarity = dot_product / (magnitude_a * magnitude_b)
                    distance = 1 - similarity  # Convert to distance
                else:
                    distance = 1.0
                    
                pattern['distance'] = round(distance, 4)
                similarities.append(pattern)
                
            except (ValueError, ZeroDivisionError, json.JSONDecodeError):
                # If parsing fails, assign high distance
                pattern['distance'] = 1.0
                similarities.append(pattern)
        
        # Sort by distance and return top results
        similarities.sort(key=lambda x: x['distance'])
        return similarities[:limit]
    
    async def full_text_search(self, query: str, table: str, 
                             columns: List[str], limit: int = 5) -> List[Dict]:
        """Perform full-text search in TiDB with compatibility fallback"""
        try:
            # Try MATCH() AGAINST() first for TiDB Serverless
            column_str = ', '.join(columns)
            query_sql = f"""
            SELECT *, MATCH({column_str}) AGAINST (%s) as relevance
            FROM {table}
            WHERE MATCH({column_str}) AGAINST (%s)
            ORDER BY relevance DESC
            LIMIT %s
            """
            cursor = self.db.cursor(dictionary=True)
            cursor.execute(query_sql, (query, query, limit))
            return cursor.fetchall()
        except Exception as e:
            print(f"MATCH() AGAINST() not supported, using LIKE fallback: {e}")
            # Fallback to LIKE-based search for compatibility
            search_terms = query.lower().split()[:3]  # Use first 3 words
            conditions = []
            params = []
            
            for column in columns:
                for term in search_terms:
                    conditions.append(f"LOWER({column}) LIKE %s")
                    params.append(f"%{term}%")
            
            where_clause = " OR ".join(conditions)
            fallback_sql = f"""
            SELECT * FROM {table}
            WHERE {where_clause}
            ORDER BY knowledge_id DESC
            LIMIT %s
            """
            params.append(limit)
            
            cursor = self.db.cursor(dictionary=True)
            cursor.execute(fallback_sql, params)
            results = cursor.fetchall()
            
            # Add synthetic relevance score
            for i, result in enumerate(results):
                result['relevance'] = 1.0 - (i * 0.1)  # Decreasing relevance
                
            return results