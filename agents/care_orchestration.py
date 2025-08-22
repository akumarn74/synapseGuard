from agents.base_agent import BaseAgent
from typing import Dict, Any, List
import json
from datetime import datetime
import asyncio

class CareOrchestrationAgent(BaseAgent):
    def __init__(self, tidb_connection):
        super().__init__("CareOrchestration", tidb_connection)
        
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Orchestrate care coordination across all stakeholders
        Input: Crisis predictions, intervention recommendations
        Output: Coordinated actions, notifications sent, appointments scheduled
        """
        patient_id = input_data['patient_id']
        crisis_data = input_data.get('crisis_prediction', {})
        immediate_actions = input_data.get('immediate_actions', [])
        
        # Step 1: Get family and care team contacts
        care_team = await self._get_care_team(patient_id)
        
        # Step 2: Execute immediate actions
        action_results = await self._execute_immediate_actions(
            patient_id, immediate_actions, care_team
        )
        
        # Step 3: Send notifications
        notification_results = await self._send_notifications(
            patient_id, crisis_data, care_team
        )
        
        # Step 4: Schedule follow-up actions
        follow_up_schedule = await self._schedule_follow_ups(
            patient_id, crisis_data, care_team
        )
        
        # Step 5: Log all coordination activities
        coordination_id = await self._log_coordination_activity(
            patient_id, action_results, notification_results, follow_up_schedule
        )
        
        return {
            'agent': self.name,
            'patient_id': patient_id,
            'coordination_id': coordination_id,
            'actions_executed': len(action_results),
            'notifications_sent': len(notification_results),
            'follow_ups_scheduled': len(follow_up_schedule),
            'care_team_contacted': len([n for n in notification_results if n['sent']]),
            'execution_summary': self._create_execution_summary(
                action_results, notification_results
            )
        }
    
    async def _get_care_team(self, patient_id: str) -> Dict[str, Any]:
        """Get patient's care team and family contacts"""
        cursor = self.db.cursor(dictionary=True)
        cursor.execute("""
            SELECT family_contacts FROM patients WHERE patient_id = %s
        """, (patient_id,))
        
        result = cursor.fetchone()
        if not result:
            return {}
        
        family_contacts = json.loads(result['family_contacts'])
        
        # Structure care team
        care_team = {
            'primary_caregiver': family_contacts.get('primary_caregiver', {}),
            'family_members': family_contacts.get('family_members', []),
            'healthcare_providers': family_contacts.get('healthcare_providers', []),
            'emergency_contacts': family_contacts.get('emergency_contacts', [])
        }
        
        return care_team
    
    async def _execute_immediate_actions(
            self, patient_id: str, immediate_actions: List[Dict], 
            care_team: Dict) -> List[Dict]:
        """Execute immediate actions from crisis prevention"""
        action_results = []
        
        for action in immediate_actions:
            action_type = action.get('type')
            result = {'action': action, 'executed': False, 'details': ''}
            
            try:
                if action_type == 'immediate_supervision':
                    # Contact primary caregiver
                    supervision_result = await self._request_immediate_supervision(
                        patient_id, care_team['primary_caregiver']
                    )
                    result['executed'] = supervision_result['success']
                    result['details'] = supervision_result['message']
                
                elif action_type == 'medical_consultation':
                    # Schedule urgent medical consultation
                    consultation_result = await self._schedule_urgent_consultation(
                        patient_id, care_team['healthcare_providers']
                    )
                    result['executed'] = consultation_result['success']
                    result['details'] = consultation_result['message']
                
                elif action_type == 'environmental_modification':
                    # Send safety checklist to caregiver
                    safety_result = await self._send_safety_checklist(
                        patient_id, care_team['primary_caregiver']
                    )
                    result['executed'] = safety_result['success']
                    result['details'] = safety_result['message']
                
                elif action_type == 'increased_monitoring':
                    # Set up monitoring schedule
                    monitoring_result = await self._setup_monitoring_schedule(
                        patient_id, care_team
                    )
                    result['executed'] = monitoring_result['success']
                    result['details'] = monitoring_result['message']
                
                action_results.append(result)
                
            except Exception as e:
                result['details'] = f"Error executing action: {str(e)}"
                action_results.append(result)
        
        return action_results
    
    async def _request_immediate_supervision(self, patient_id: str, 
                                           primary_caregiver: Dict) -> Dict:
        """Request immediate supervision from primary caregiver"""
        if not primary_caregiver:
            return {'success': False, 'message': 'No primary caregiver on file'}
        
        # Send SMS alert
        message = f"""
        URGENT: {primary_caregiver.get('patient_name', 'Patient')} needs immediate supervision.
        Our AI system detected patterns indicating increased confusion risk.
        Please check on them within the next hour.
        Reply SAFE when you're with them.
        """
        
        sms_result = await self._send_sms(
            primary_caregiver.get('phone'), message
        )
        
        # Send email with detailed information
        email_result = await self._send_email(
            primary_caregiver.get('email'),
            "Urgent: Immediate Supervision Needed",
            self._create_supervision_email_content(patient_id)
        )
        
        return {
            'success': sms_result or email_result,
            'message': f"Supervision request sent via SMS: {sms_result}, Email: {email_result}"
        }
    
    async def _schedule_urgent_consultation(self, patient_id: str, 
                                          healthcare_providers: List[Dict]) -> Dict:
        """Schedule urgent medical consultation"""
        if not healthcare_providers:
            return {'success': False, 'message': 'No healthcare providers on file'}
        
        # Try to reach primary healthcare provider first
        primary_provider = next((p for p in healthcare_providers 
                               if p.get('type') == 'primary_care'), 
                               healthcare_providers[0] if healthcare_providers else None)
        
        if not primary_provider:
            return {'success': False, 'message': 'No primary care provider found'}
        
        # Send urgent consultation request
        consultation_message = f"""
        Urgent consultation needed for patient {patient_id}.
        AI system detected significant cognitive pattern changes.
        Risk score: HIGH
        Recommended consultation within 2 hours.
        Please confirm availability.
        """
        
        # Try multiple contact methods
        contact_results = []
        
        if primary_provider.get('phone'):
            sms_result = await self._send_sms(
                primary_provider['phone'], consultation_message
            )
            contact_results.append(f"SMS: {sms_result}")
        
        if primary_provider.get('email'):
            email_result = await self._send_email(
                primary_provider['email'],
                "Urgent: Patient Consultation Needed",
                self._create_consultation_email_content(patient_id)
            )
            contact_results.append(f"Email: {email_result}")
        
        return {
            'success': any(contact_results),
            'message': f"Consultation request sent: {', '.join(contact_results)}"
        }
    
    async def _send_safety_checklist(self, patient_id: str, 
                                   primary_caregiver: Dict) -> Dict:
        """Send immediate safety checklist to caregiver"""
        safety_checklist = """
        IMMEDIATE SAFETY CHECKLIST:
        ☐ Remove or secure sharp objects
        ☐ Ensure doors and windows are locked
        ☐ Check that stove and appliances are off
        ☐ Remove trip hazards
        ☐ Stay with patient or ensure supervised
        ☐ Have emergency contacts ready
        ☐ Monitor for confusion or agitation
        
        Reply CHECKLIST COMPLETE when done.
        """
        
        email_sent = await self._send_email(
            primary_caregiver.get('email'),
            "URGENT: Safety Checklist - Complete Immediately",
            safety_checklist
        )
        
        sms_sent = await self._send_sms(
            primary_caregiver.get('phone'),
            "URGENT: Safety checklist sent to email. Please complete immediately."
        )
        
        return {
            'success': email_sent or sms_sent,
            'message': f"Safety checklist sent via email: {email_sent}, SMS: {sms_sent}"
        }
    
    async def _setup_monitoring_schedule(self, patient_id: str, 
                                       care_team: Dict) -> Dict:
        """Set up increased monitoring schedule"""
        monitoring_plan = {
            'frequency': 'every_2_hours',
            'duration': '24_hours',
            'checkpoints': [
                '8:00 AM - Morning routine check',
                '10:00 AM - Activity engagement',
                '12:00 PM - Lunch and medication',
                '2:00 PM - Afternoon activities',
                '4:00 PM - Social interaction',
                '6:00 PM - Evening routine',
                '8:00 PM - Preparation for night',
                '10:00 PM - Final safety check'
            ]
        }
        
        # Send monitoring schedule to all family members
        family_contacts = care_team.get('family_members', [])
        primary_caregiver = care_team.get('primary_caregiver', {})
        
        all_contacts = [primary_caregiver] + family_contacts
        notification_results = []
        
        for contact in all_contacts:
            if contact.get('email'):
                email_result = await self._send_email(
                    contact['email'],
                    "Increased Monitoring Schedule - Next 24 Hours",
                    self._create_monitoring_schedule_email(monitoring_plan)
                )
                notification_results.append(email_result)
        
        return {
            'success': any(notification_results),
            'message': f"Monitoring schedule sent to {len(notification_results)} contacts"
        }
    
    async def _send_notifications(self, patient_id: str, crisis_data: Dict, 
                                care_team: Dict) -> List[Dict]:
        """Send notifications to care team members"""
        notifications = []
        risk_score = crisis_data.get('risk_score', 0)
        crisis_type = crisis_data.get('crisis_type', 'unknown')
        
        # Determine notification urgency and recipients
        if risk_score > 0.8:
            # Critical - notify everyone immediately
            recipients = self._get_all_contacts(care_team)
            urgency = 'CRITICAL'
        elif risk_score > 0.6:
            # High - notify primary caregiver and key family
            recipients = [care_team.get('primary_caregiver')] + care_team.get('family_members', [])[:2]
            urgency = 'HIGH'
        else:
            # Medium - notify primary caregiver
            recipients = [care_team.get('primary_caregiver')]
            urgency = 'MEDIUM'
        
        # Send notifications
        for recipient in recipients:
            if not recipient:
                continue
                
            notification_result = {
                'recipient': recipient.get('name', 'Unknown'),
                'contact_method': [],
                'sent': False
            }
            
            # Create personalized message
            message = await self._create_notification_message(
                patient_id, crisis_data, urgency, recipient
            )
            
            # Send via SMS if available
            if recipient.get('phone'):
                sms_result = await self._send_sms(recipient['phone'], message['sms'])
                notification_result['contact_method'].append(f"SMS: {sms_result}")
                if sms_result:
                    notification_result['sent'] = True
            
            # Send via email if available
            if recipient.get('email'):
                email_result = await self._send_email(
                    recipient['email'], 
                    message['email_subject'],
                    message['email_body']
                )
                notification_result['contact_method'].append(f"Email: {email_result}")
                if email_result:
                    notification_result['sent'] = True
            
            notifications.append(notification_result)
        
        # Log notifications in database
        await self._log_notifications(patient_id, notifications)
        
        return notifications
    
    async def _schedule_follow_ups(self, patient_id: str, crisis_data: Dict, 
                                 care_team: Dict) -> List[Dict]:
        """Schedule follow-up actions and appointments"""
        follow_ups = []
        risk_score = crisis_data.get('risk_score', 0)
        
        # Schedule based on risk level
        if risk_score > 0.8:
            # Critical follow-ups
            follow_ups.extend([
                {
                    'type': 'medical_follow_up',
                    'schedule': '4 hours',
                    'description': 'Emergency medical assessment',
                    'recipient': 'healthcare_provider'
                },
                {
                    'type': 'family_check_in',
                    'schedule': '2 hours',
                    'description': 'Family status update call',
                    'recipient': 'primary_caregiver'
                },
                {
                    'type': 'pattern_reassessment',
                    'schedule': '6 hours',
                    'description': 'Re-evaluate cognitive patterns',
                    'recipient': 'system_auto'
                }
            ])
        
        elif risk_score > 0.6:
            # High priority follow-ups
            follow_ups.extend([
                {
                    'type': 'care_plan_review',
                    'schedule': '24 hours',
                    'description': 'Review and adjust care plan',
                    'recipient': 'healthcare_provider'
                },
                {
                    'type': 'family_coordination',
                    'schedule': '12 hours',
                    'description': 'Coordinate family care activities',
                    'recipient': 'primary_caregiver'
                }
            ])
        
        else:
            # Standard follow-ups
            follow_ups.extend([
                {
                    'type': 'routine_check',
                    'schedule': '48 hours',
                    'description': 'Routine pattern monitoring',
                    'recipient': 'system_auto'
                }
            ])
        
        # Store follow-up schedule in database
        for follow_up in follow_ups:
            await self._store_follow_up_schedule(patient_id, follow_up)
        
        return follow_ups
    
    async def _send_sms(self, phone_number: str, message: str) -> bool:
        """Send SMS message (Mock implementation for demo)"""
        try:
            # Mock SMS service - in real implementation, integrate with Twilio, AWS SNS, etc.
            print(f"SMS to {phone_number}: {message}")
            return True  # Simulate successful send
        except Exception as e:
            print(f"SMS failed: {e}")
            return False
    
    async def _send_email(self, email: str, subject: str, body: str) -> bool:
        """Send email message (Mock implementation for demo)"""
        try:
            # Mock email service - in real implementation, integrate with SendGrid, SES, etc.
            print(f"Email to {email}")
            print(f"Subject: {subject}")
            print(f"Body: {body[:100]}...")
            return True  # Simulate successful send
        except Exception as e:
            print(f"Email failed: {e}")
            return False
    
    def _get_all_contacts(self, care_team: Dict) -> List[Dict]:
        """Get all contacts from care team"""
        contacts = []
        
        if care_team.get('primary_caregiver'):
            contacts.append(care_team['primary_caregiver'])
        
        contacts.extend(care_team.get('family_members', []))
        contacts.extend(care_team.get('healthcare_providers', []))
        contacts.extend(care_team.get('emergency_contacts', []))
        
        # Remove duplicates based on email or phone
        seen = set()
        unique_contacts = []
        for contact in contacts:
            identifier = contact.get('email') or contact.get('phone')
            if identifier and identifier not in seen:
                seen.add(identifier)
                unique_contacts.append(contact)
        
        return unique_contacts
    
    async def _create_notification_message(self, patient_id: str, crisis_data: Dict, 
                                          urgency: str, recipient: Dict) -> Dict:
        """Create AI-generated, personalized notification message"""
        try:
            risk_score = crisis_data.get('risk_score', 0)
            crisis_type = crisis_data.get('crisis_type', 'Pattern change detected')
            patient_name = recipient.get('patient_name', 'Patient')
            recipient_name = recipient.get('name', 'Caregiver')
            relationship = recipient.get('relationship', 'caregiver')
            
            prompt = f"""
            You are a compassionate healthcare communication specialist. Create personalized care alert messages for a family member who needs to be informed about their loved one's condition.

            CONTEXT:
            - Patient: {patient_name}
            - Recipient: {recipient_name} ({relationship})
            - Crisis Type: {crisis_type}
            - Risk Score: {risk_score:.2f}/1.0
            - Urgency Level: {urgency}

            Create two messages:
            1. SMS (max 160 characters): Urgent but reassuring, includes key info
            2. Email: Detailed but compassionate, includes specific actions

            Requirements:
            - Use warm, professional tone that reduces anxiety while conveying urgency
            - Be specific about next steps
            - Acknowledge the emotional impact on family
            - Include reassurances about AI monitoring quality
            - Personalize based on relationship to patient

            Format as JSON:
            {{
                "sms": "message text",
                "email_subject": "subject line",
                "email_body": "detailed email content"
            }}
            """

            response = await self.llm_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=600,
                temperature=0.3
            )
            
            ai_response = response.choices[0].message.content.strip()
            
            try:
                import json
                messages = json.loads(ai_response)
                return messages
            except json.JSONDecodeError:
                # Fallback to parsing from text
                return self._parse_message_from_text(ai_response, patient_id, crisis_data, urgency, recipient)
            
        except Exception as e:
            print(f"AI message generation failed: {e}")
            return self._create_fallback_message(patient_id, crisis_data, urgency, recipient)
    
    def _parse_message_from_text(self, text: str, patient_id: str, crisis_data: Dict, 
                               urgency: str, recipient: Dict) -> Dict:
        """Parse message components from AI text response"""
        lines = text.split('\n')
        sms_message = ""
        email_subject = ""
        email_body = ""
        
        current_section = ""
        for line in lines:
            line = line.strip()
            if 'sms:' in line.lower():
                current_section = "sms"
                sms_message = line.split(':', 1)[1].strip().strip('"')
            elif 'email_subject:' in line.lower() or 'subject:' in line.lower():
                current_section = "subject"
                email_subject = line.split(':', 1)[1].strip().strip('"')
            elif 'email_body:' in line.lower() or 'email:' in line.lower():
                current_section = "body"
                email_body = line.split(':', 1)[1].strip().strip('"')
            elif current_section == "body" and line:
                email_body += "\n" + line
        
        return {
            'sms': sms_message or f"{urgency}: {recipient.get('patient_name', 'Patient')} needs attention. Check email for details.",
            'email_subject': email_subject or f"{urgency}: Care Alert for {recipient.get('patient_name', 'Patient')}",
            'email_body': email_body or self._create_fallback_message(patient_id, crisis_data, urgency, recipient)['email_body']
        }
    
    def _create_fallback_message(self, patient_id: str, crisis_data: Dict, 
                               urgency: str, recipient: Dict) -> Dict:
        """Fallback message creation"""
        risk_score = crisis_data.get('risk_score', 0)
        crisis_type = crisis_data.get('crisis_type', 'Pattern change detected')
        patient_name = recipient.get('patient_name', 'Patient')
        
        # SMS message (short)
        sms_message = f"{urgency}: {patient_name} needs attention. " \
                     f"AI detected {crisis_type}. Risk: {risk_score:.1f}/1.0. " \
                     f"Please check on them. Details in email."
        
        # Email subject
        email_subject = f"{urgency}: Care Alert for {patient_name}"
        
        # Email body (detailed)
        email_body = f"""
Dear {recipient.get('name', 'Caregiver')},

Our SynapseGuard AI system has detected concerning changes in {patient_name}'s behavioral patterns.

ALERT DETAILS:
- Risk Level: {urgency}
- Risk Score: {risk_score:.2f}/1.0
- Pattern Change: {crisis_type}
- Detection Time: {datetime.now().strftime('%Y-%m-%d %H:%M')}

RECOMMENDED ACTIONS:
{self._format_recommended_actions(crisis_data)}

WHAT THIS MEANS:
{self._explain_crisis_type(crisis_type)}

NEXT STEPS:
1. Check on {patient_name} as soon as possible
2. Follow the recommended actions above
3. Contact healthcare provider if condition worsens
4. Reply to this email with status update

This alert is generated by AI analysis of behavioral patterns. While our system is highly accurate, please use your judgment and consult healthcare professionals for medical decisions.

Best regards,
SynapseGuard Care Team

Emergency Contact: [Your emergency number]
System ID: {patient_id}
        """
        
        return {
            'sms': sms_message,
            'email_subject': email_subject,
            'email_body': email_body
        }
    
    def _format_recommended_actions(self, crisis_data: Dict) -> str:
        """Format recommended actions for email"""
        actions = []
        risk_score = crisis_data.get('risk_score', 0)
        
        if risk_score > 0.8:
            actions = [
                "• Stay with patient or arrange immediate supervision",
                "• Contact healthcare provider immediately",
                "• Ensure safe environment (remove hazards)",
                "• Monitor for confusion, agitation, or wandering",
                "• Have emergency contacts readily available"
            ]
        elif risk_score > 0.6:
            actions = [
                "• Check on patient within 1 hour",
                "• Gently redirect to familiar activities",
                "• Monitor more closely for next 24 hours",
                "• Consider contacting healthcare provider",
                "• Reinforce daily routine structure"
            ]
        else:
            actions = [
                "• Check on patient when convenient",
                "• Continue normal monitoring routine",
                "• Note any unusual behaviors",
                "• Maintain regular care schedule"
            ]
        
        return '\n'.join(actions)
    
    def _explain_crisis_type(self, crisis_type: str) -> str:
        """Explain what the crisis type means"""
        explanations = {
            'severe_confusion_episode': "Patient may experience significant disorientation, difficulty recognizing familiar people or places, or severe memory lapses.",
            'moderate_disorientation': "Patient may have increased confusion about time, place, or routine activities.",
            'routine_disruption': "Patient's normal daily patterns have changed significantly, which may indicate cognitive changes.",
            'mild_cognitive_fluctuation': "Subtle changes in cognitive patterns have been detected that may require monitoring."
        }
        
        return explanations.get(crisis_type, "Changes in behavioral patterns have been detected that may require attention.")
    
    async def _log_coordination_activity(self, patient_id: str, 
                                       action_results: List[Dict],
                                       notification_results: List[Dict],
                                       follow_up_schedule: List[Dict]) -> str:
        """Log all coordination activities"""
        coordination_id = f"coord_{patient_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        coordination_data = {
            'coordination_id': coordination_id,
            'patient_id': patient_id,
            'timestamp': datetime.now().isoformat(),
            'actions_executed': action_results,
            'notifications_sent': notification_results,
            'follow_ups_scheduled': follow_up_schedule
        }
        
        # Store in database
        cursor = self.db.cursor()
        cursor.execute("""
            INSERT INTO family_communications 
            (comm_id, patient_id, recipient_type, message_content, 
             communication_type, sent_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            coordination_id, patient_id, 'system_log',
            json.dumps(coordination_data), 'coordination_summary',
            datetime.now()
        ))
        
        self.db.commit()
        return coordination_id
    
    def _create_execution_summary(self, action_results: List[Dict], 
                                notification_results: List[Dict]) -> str:
        """Create summary of execution results"""
        actions_executed = len([a for a in action_results if a['executed']])
        total_actions = len(action_results)
        
        notifications_sent = len([n for n in notification_results if n['sent']])
        total_notifications = len(notification_results)
        
        return f"Actions: {actions_executed}/{total_actions} executed, " \
               f"Notifications: {notifications_sent}/{total_notifications} sent"

    def _create_supervision_email_content(self, patient_id: str) -> str:
        """Create detailed supervision email content"""
        return f"""
URGENT SUPERVISION REQUEST

Patient ID: {patient_id}
Alert Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Our AI monitoring system has detected behavioral patterns that indicate an increased risk of confusion or disorientation. Immediate supervision is recommended to ensure patient safety.

IMMEDIATE ACTION REQUIRED:
1. Go to the patient's location within the next hour
2. Conduct a visual safety check
3. Engage the patient in familiar conversation
4. Ensure they are in a safe environment
5. Reply to this email when you are with them

If you cannot reach the patient immediately, please contact emergency services.

SynapseGuard AI Monitoring System
        """

    def _create_consultation_email_content(self, patient_id: str) -> str:
        """Create detailed consultation email content"""
        return f"""
URGENT MEDICAL CONSULTATION REQUEST

Patient ID: {patient_id}
Alert Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Our AI system has detected significant changes in cognitive patterns that warrant immediate medical attention.

CLINICAL DETAILS:
- Pattern deviation detected in routine behaviors
- Risk assessment indicates potential crisis within 2-6 hours
- Recommendation: In-person or telehealth consultation within 2 hours

Please confirm your availability and preferred consultation method.

SynapseGuard Clinical Alert System
        """

    def _create_monitoring_schedule_email(self, monitoring_plan: Dict) -> str:
        """Create monitoring schedule email content"""
        checkpoints = '\n'.join(monitoring_plan['checkpoints'])
        
        return f"""
ENHANCED MONITORING SCHEDULE

Duration: {monitoring_plan['duration']}
Frequency: {monitoring_plan['frequency']}

SCHEDULED CHECKPOINTS:
{checkpoints}

Please coordinate among family members to ensure continuous monitoring coverage. Report any concerning behaviors immediately.

SynapseGuard Care Coordination
        """

    async def _log_notifications(self, patient_id: str, notifications: List[Dict]):
        """Log notifications in database"""
        for notification in notifications:
            cursor = self.db.cursor()
            cursor.execute("""
                INSERT INTO family_communications 
                (comm_id, patient_id, recipient_type, message_content, 
                 communication_type, sent_at)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                f"notif_{patient_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
                patient_id, 'family_member',
                json.dumps(notification), 'alert',
                datetime.now()
            ))
            self.db.commit()

    async def _store_follow_up_schedule(self, patient_id: str, follow_up: Dict):
        """Store follow-up schedule in database"""
        cursor = self.db.cursor()
        cursor.execute("""
            INSERT INTO family_communications 
            (comm_id, patient_id, recipient_type, message_content, 
             communication_type, sent_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            f"followup_{patient_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            patient_id, follow_up['recipient'],
            json.dumps(follow_up), 'follow_up',
            datetime.now()
        ))
        self.db.commit()