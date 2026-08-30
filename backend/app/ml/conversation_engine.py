from typing import Dict, Any, List, Optional


class ConversationalIntakeEngine:
    """
    Rule-based conversational guidance engine for NHAA 14566.

    Responsibilities:
    - Determine the next important question based on NLP results.
    - Avoid unnecessary/repetitive questioning.
    - Prioritize immediate safety.
    - Provide controlled, pre-approved questions.
    - Track which information has already been collected.
    - Decide when enough information has been gathered for assessment.

    This engine does NOT:
    - diagnose mental health conditions
    - determine whether someone is truthful
    - independently calculate SVI
    - replace a trained human decision-maker
    """

    def __init__(self):
        # Approved questions.
        # Keeping these predefined makes the conversation predictable
        # and safer than allowing an LLM to generate arbitrary questions.
        self.questions = {
            "immediate_safety": {
                "id": "immediate_safety",
                "text": (
                    "Are you or your family in immediate danger right now?"
                ),
                "type": "safety",
                "options": ["Yes", "No", "Not sure"],
                "priority": "critical",
            },

            "perpetrator_nearby": {
                "id": "perpetrator_nearby",
                "text": (
                    "Is the person or group who threatened you currently nearby?"
                ),
                "type": "safety",
                "options": ["Yes", "No", "Not sure"],
                "priority": "high",
            },

            "police_approached": {
                "id": "police_approached",
                "text": (
                    "Have you already approached the police for help regarding "
                    "this incident?"
                ),
                "type": "police",
                "options": ["Yes", "No", "Not yet"],
                "priority": "high",
            },

            "police_fir_refused": {
                "id": "police_fir_refused",
                "text": (
                    "Were you refused when you tried to file a police complaint "
                    "or FIR?"
                ),
                "type": "police",
                "options": ["Yes", "No", "Not sure"],
                "priority": "high",
            },

            "repeat_harassment": {
                "id": "repeat_harassment",
                "text": (
                    "Has this harassment, threat, or incident happened more "
                    "than once?"
                ),
                "type": "incident",
                "options": ["Yes", "No", "Not sure"],
                "priority": "medium",
            },

            "support_needed": {
                "id": "support_needed",
                "text": (
                    "What kind of support would you like help with?"
                ),
                "type": "support",
                "options": [
                    "Legal assistance",
                    "Counselling",
                    "Emergency assistance",
                    "Other support",
                ],
                "priority": "medium",
            },
        }

        # Information that is important for the assessment.
        self.required_information = {
            "immediate_safety",
            "support_needed",
        }

    # ------------------------------------------------------------------
    # Main method
    # ------------------------------------------------------------------

    def get_next_question(
        self,
        nlp_result: Dict[str, Any],
        conversation_state: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Decide what the chatbot should ask next.

        Parameters
        ----------
        nlp_result:
            Output from NLPAnalyticsEngine.analyze_narrative()

        conversation_state:
            Information already collected during the conversation.

        Returns
        -------
        Dict containing:
            should_continue
            next_question
            reason
            priority
            collected_information
        """

        state = conversation_state.copy() if conversation_state else {}
        asked_questions = set(
            state.get("asked_questions", [])
        )
        collected = state.get(
            "collected_information",
            {}
        )
        # Preserve information detected from the original narrative
        # across subsequent conversation turns.
        state_categories = set(
            state.get("detected_categories", [])
        )
        current_categories = set(
            nlp_result.get("detected_categories", [])
        )
        categories = state_categories | current_categories
        state["detected_categories"] = list(categories)

        # --------------------------------------------------------------
        # 1. SAFETY HAS THE HIGHEST PRIORITY
        # --------------------------------------------------------------

        immediate_safety = collected.get("immediate_safety")

        if immediate_safety is None:
            question = self.questions["immediate_safety"]

            return self._question_response(
                question=question,
                reason="Immediate safety status has not yet been established.",
                asked_questions=asked_questions,
                collected=collected,

            )

        # --------------------------------------------------------------
        # 2. If immediate danger is confirmed
        # --------------------------------------------------------------

        if self._is_yes(immediate_safety):

            if "perpetrator_nearby" not in collected:

                question = self.questions["perpetrator_nearby"]

                return self._question_response(
                    question=question,
                    reason=(
                        "Immediate danger was reported, so the next "
                        "priority is understanding the immediate safety context."
                    ),
                    asked_questions=asked_questions,
                    collected=collected,
                )

        # --------------------------------------------------------------
        # 3. SUICIDAL IDEATION
        # --------------------------------------------------------------

        entities = nlp_result.get("entities", {})

        if entities.get("has_suicidal_flag", False):

            return {
                "should_continue": False,
                "action": "priority_human_intervention",
                "priority": "critical",
                "reason": (
                    "The NLP engine detected a possible self-harm or "
                    "suicidal-ideation indicator."
                ),
                "next_question": None,
                "options": [],
                "collected_information": collected,
            }

        # --------------------------------------------------------------
        # 4. THREAT / INTIMIDATION
        # --------------------------------------------------------------

        

        if "intimidation_threats" in categories:

            if "perpetrator_nearby" not in collected:

                question = self.questions["perpetrator_nearby"]

                return self._question_response(
                    question=question,
                    reason=(
                        "Threat indicators were detected and the current "
                        "physical proximity of the alleged perpetrator "
                        "is unknown."
                    ),
                    asked_questions=asked_questions,
                    collected=collected,
                )

        # --------------------------------------------------------------
        # 5. POLICE / FIR RELATED INFORMATION
        # --------------------------------------------------------------

        if "police_approached" not in collected:

            # Ask this when police-related language is present.
            police_related = (
                "police" in nlp_result.get(
                    "detected_categories",
                    []
                )
                or self._police_mentioned(nlp_result)
            )

            if police_related:

                question = self.questions["police_approached"]

                return self._question_response(
                    question=question,
                    reason=(
                        "Police-related information was detected in "
                        "the narrative."
                    ),
                    asked_questions=asked_questions,
                    collected=collected,
                )

        # --------------------------------------------------------------
        # 6. CHECK FOR POLICE FIR REFUSAL
        # --------------------------------------------------------------

        if collected.get("police_approached") is True:

            if "police_fir_refused" not in collected:

                question = self.questions["police_fir_refused"]

                return self._question_response(
                    question=question,
                    reason=(
                        "The user indicated that they approached the police. "
                        "FIR/complaint refusal should be clarified."
                    ),
                    asked_questions=asked_questions,
                    collected=collected,
                )

        # --------------------------------------------------------------
        # 7. REPEATED HARASSMENT
        # --------------------------------------------------------------

        if (
            "intimidation_threats" in categories
            or "displacement_isolation" in categories
            or "caste_discrimination" in categories
        ):

            if "repeat_harassment" not in collected:

                question = self.questions["repeat_harassment"]

                return self._question_response(
                    question=question,
                    reason=(
                        "The narrative contains ongoing-risk indicators. "
                        "The system needs to know whether the incident "
                        "has happened repeatedly."
                    ),
                    asked_questions=asked_questions,
                    collected=collected,
                )

        # --------------------------------------------------------------
        # 8. SUPPORT TYPE
        # --------------------------------------------------------------

        if "support_needed" not in collected:

            question = self.questions["support_needed"]

            return self._question_response(
                question=question,
                reason=(
                    "The available information is sufficient to ask "
                    "what type of assistance the user wants."
                ),
                asked_questions=asked_questions,
                collected=collected,
            )

        # --------------------------------------------------------------
        # 9. ENOUGH INFORMATION
        # --------------------------------------------------------------

        return {
            "should_continue": False,
            "action": "proceed_to_assessment",
            "priority": "normal",
            "reason": (
                "The required conversational information has been collected."
            ),
            "next_question": None,
            "options": [],
            "collected_information": collected,
        }

    # ------------------------------------------------------------------
    # Helper methods
    # ------------------------------------------------------------------

    def _question_response(
        self,
        question: Dict[str, Any],
        reason: str,
        asked_questions: set,
        collected: Dict[str, Any],
    ) -> Dict[str, Any]:

        return {
            "should_continue": True,
            "action": "ask_question",
            "priority": question["priority"],
            "next_question": question["text"],
            "question_id": question["id"],
            "question_type": question["type"],
            "options": question["options"],
            "reason": reason,
            "collected_information": collected,
            "asked_questions": list(
                asked_questions | {question["id"]}
            ),
        }

    @staticmethod
    def _is_yes(value: Any) -> bool:
        """
        Handles both frontend strings and Python booleans.
        """

        if isinstance(value, bool):
            return value

        if not isinstance(value, str):
            return False

        return value.strip().lower() in {
            "yes",
            "y",
            "true",
            "haan",
            "ha",
        }

    @staticmethod
    def _police_mentioned(nlp_result: Dict[str, Any]) -> bool:
        """
        Check whether the NLP entity extraction detected
        police-related information.
        """

        entities = nlp_result.get("entities", {})

        perpetrators = entities.get(
            "perpetrators_mentioned",
            []
        )

        for perpetrator in perpetrators:

            if "police" in perpetrator.lower():
                return True

        threat_type = entities.get(
            "threat_type",
            ""
        )

        return "police" in threat_type.lower()

    # ------------------------------------------------------------------
    # Conversation state helper
    # ------------------------------------------------------------------

    def update_state(
        self,
        state: Optional[Dict[str, Any]],
        question_id: str,
        answer: Any,
    ) -> Dict[str, Any]:
        """
        Store the answer to a question.

        Example:

            state = engine.update_state(
                state,
                "immediate_safety",
                "Yes"
            )
        """

        current_state = state.copy() if state else {}

        asked_questions = list(
            current_state.get("asked_questions", [])
        )

        if question_id not in asked_questions:
            asked_questions.append(question_id)

        collected_information = dict(
            current_state.get(
                "collected_information",
                {}
            )
        )

        collected_information[question_id] = answer

        current_state["asked_questions"] = asked_questions
        current_state["collected_information"] = collected_information

        return current_state


# Singleton instance
conversation_engine = ConversationalIntakeEngine()