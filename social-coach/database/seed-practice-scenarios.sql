-- Seed practice scenarios for different event types and difficulty levels

-- Date Scenarios
INSERT INTO practice_scenarios (event_type, scenario_name, description, example_dialogue, suggested_responses, difficulty_level, tags) VALUES
(
  'date',
  'Opening Conversation',
  'You''ve just met your date at a coffee shop. They smile and say hello.',
  '[{"speaker": "them", "text": "Hi! It''s so nice to finally meet you in person!"}, {"speaker": "narrator", "text": "They seem friendly and a bit nervous too"}]',
  '[{"context": "Matching their energy", "response": "Hi! Yes, it''s great to meet you too! How was your journey here?", "why_it_works": "Mirrors their enthusiasm and asks an easy opening question", "variations": ["Hi! Same here! Did you find the place okay?", "Hello! I''m glad we could meet up. How''s your day been?"]}]',
  1,
  '{"opening", "greeting"}'
),
(
  'date',
  'Handling Personal Questions',
  'Your date asks about your previous relationships.',
  '[{"speaker": "them", "text": "So, when was your last relationship? What happened?"}, {"speaker": "narrator", "text": "They seem genuinely curious, not judgmental"}]',
  '[{"context": "Honest but bounded", "response": "My last relationship ended about [timeframe] ago. We realized we wanted different things. I''ve learned a lot since then. How about you?", "why_it_works": "Shares without oversharing, redirects appropriately", "variations": ["I''ve been focusing on myself for a while now. What about you?", "I prefer to focus on the present and future rather than the past. What are you looking for?"]}]',
  2,
  '{"boundaries", "personal_questions"}'
),

-- Interview Scenarios
(
  'interview',
  'Weakness Question',
  'The interviewer asks about your greatest weakness.',
  '[{"speaker": "them", "text": "What would you say is your greatest weakness?"}, {"speaker": "narrator", "text": "Classic interview question - they''re assessing self-awareness"}]',
  '[{"context": "Growth-focused answer", "response": "I sometimes get very focused on details, which can slow me down. I''ve been working on balancing thoroughness with efficiency by setting time limits for tasks.", "why_it_works": "Shows self-awareness and active improvement", "variations": ["I can be overly self-critical. I''m learning to acknowledge my wins and progress.", "Public speaking used to make me nervous. I''ve been practicing through team presentations."]}]',
  2,
  '{"difficult_questions", "self_reflection"}'
),
(
  'interview',
  'Salary Expectations',
  'The interviewer asks about your salary expectations.',
  '[{"speaker": "them", "text": "What are your salary expectations for this role?"}, {"speaker": "narrator", "text": "They seem to be gauging if you''re in their budget range"}]',
  '[{"context": "Research-based response", "response": "Based on my research for similar roles in this area and my experience, I''m looking for a range of $X to $Y. I''m also interested in the total compensation package and growth opportunities.", "why_it_works": "Shows you''ve done homework, gives flexibility", "variations": ["I''m looking for a competitive offer based on the role and my experience. What range did you have in mind?", "I''m flexible and more interested in finding the right fit. Can you share the range for this position?"]}]',
  3,
  '{"negotiation", "money_talk"}'
),

-- Networking Scenarios
(
  'networking',
  'Breaking Into a Group',
  'You see a group discussing something interesting at a networking event.',
  '[{"speaker": "narrator", "text": "Three people are discussing industry trends. One person makes eye contact with you."}, {"speaker": "them", "text": "The person who noticed you smiles slightly"}]',
  '[{"context": "Polite entry", "response": "Hi! Mind if I join? I couldn''t help but overhear you discussing [topic] - it''s something I''m really interested in. I''m [name].", "why_it_works": "Acknowledges the group, shows relevance, introduces self", "variations": ["Hello! This sounds like an interesting conversation. I''m [name] from [company].", "Hi everyone! I work in [related field] and would love to hear your thoughts. I''m [name]."]}]',
  2,
  '{"group_dynamics", "joining_conversation"}'
),
(
  'networking',
  'Exchanging Contact Info',
  'After a good conversation, you want to exchange contact information.',
  '[{"speaker": "narrator", "text": "You''ve been chatting for 10 minutes about shared interests"}, {"speaker": "them", "text": "This has been a really interesting conversation!"}]',
  '[{"context": "Natural transition", "response": "I''ve really enjoyed this too! I''d love to continue the conversation. Can I get your LinkedIn/email?", "why_it_works": "Acknowledges mutual interest, suggests specific follow-up", "variations": ["This has been great! Should we connect on LinkedIn?", "I''d love to hear more about [their project]. Here''s my card - let''s stay in touch!"]}]',
  1,
  '{"closing", "contact_exchange"}'
),

-- Casual Social Scenarios
(
  'casual',
  'Running Into Someone',
  'You unexpectedly run into a colleague/acquaintance while shopping.',
  '[{"speaker": "them", "text": "Oh hey! I didn''t expect to see you here! How are you?"}, {"speaker": "narrator", "text": "They seem happy but you weren''t prepared for social interaction"}]',
  '[{"context": "Friendly but brief", "response": "Hi! What a surprise! I''m good, just doing some shopping. How are you?", "why_it_works": "Acknowledges them warmly but signals you''re busy", "variations": ["Hey! Good to see you! I''m just quickly grabbing some things. How''ve you been?", "Oh hi! Nice to run into you. I''m in a bit of a rush but it''s great to see you!"]}]',
  1,
  '{"unexpected", "small_talk"}'
),
(
  'casual',
  'Declining Without Hurt Feelings',
  'A friend invites you to an event but you need downtime.',
  '[{"speaker": "them", "text": "We''re having a game night Saturday. You should totally come! It''ll be fun!"}, {"speaker": "narrator", "text": "They''re enthusiastic and you don''t want to hurt their feelings"}]',
  '[{"context": "Kind but clear", "response": "That sounds really fun! I can''t make it this time - I need some downtime this weekend. But thanks for thinking of me!", "why_it_works": "Validates the event, clear boundary, shows appreciation", "variations": ["I appreciate the invite! I''m taking some me-time this weekend, but have fun!", "Thanks for including me! I''ve got plans already but hope you all have a great time!"]}]',
  2,
  '{"boundaries", "declining_invitations"}'
);

-- Additional scenarios for anxiety/overwhelm situations
INSERT INTO practice_scenarios (event_type, scenario_name, description, example_dialogue, suggested_responses, difficulty_level, tags) VALUES
(
  'other',
  'Panic in Public',
  'You''re feeling overwhelmed at an event and someone notices.',
  '[{"speaker": "them", "text": "Are you okay? You look a bit pale."}, {"speaker": "narrator", "text": "You''re having anxiety but trying to hide it"}]',
  '[{"context": "Honest but contained", "response": "I''m feeling a bit overwhelmed. I just need a moment. Thank you for checking on me.", "why_it_works": "Acknowledges without oversharing, sets boundary", "variations": ["Just need some fresh air. I''ll be back in a minute.", "Thanks for asking. I get a bit anxious in crowds. I''ll be okay."]}]',
  3,
  '{"anxiety", "overwhelm", "support"}'
),
(
  'other',
  'Sensory Overload',
  'The environment is too loud/bright and affecting you.',
  '[{"speaker": "them", "text": "Isn''t this place amazing? The music is so energetic!"}, {"speaker": "narrator", "text": "The noise is actually overwhelming for you"}]',
  '[{"context": "Advocating for needs", "response": "It''s definitely lively! Actually, it''s a bit loud for me. Mind if we find somewhere quieter to chat?", "why_it_works": "Acknowledges their perspective while expressing needs", "variations": ["Yeah, it''s very energetic! I''m finding it hard to hear though - could we move over there?", "It''s quite something! I''m a bit sensitive to noise - would you mind if we stepped outside for a bit?"]}]',
  2,
  '{"sensory", "self_advocacy", "environment"}'
);

-- Create indexes for better query performance
CREATE INDEX idx_practice_scenarios_event_type ON practice_scenarios(event_type);
CREATE INDEX idx_practice_scenarios_difficulty ON practice_scenarios(difficulty_level);
CREATE INDEX idx_practice_scenarios_tags ON practice_scenarios USING gin(tags);