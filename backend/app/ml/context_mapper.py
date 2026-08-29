from typing import Dict, Any


class ConversationContextMapper:
    """
    Converts conversational intake answers into the context_factors
    expected by the Glass-Box SVI Engine.

    This module does NOT calculate the SVI score.
    It only converts collected information into structured
    contextual risk factors.
    """

    def __init__(self):
        # Mapping between chatbot question IDs and SVI context fields.
        self.boolean_mapping = {
            "repeat_harassment": "is_repeat_harassment",
            "police_fir_refused": "police_fir_refused",
            "perpetrator_in_power": "perpetrator_in_power",
        }

    def map_context(
        self,
        conversation_state: Dict[str, Any],
        nlp_result: Dict[str, Any] | None = None,
    ) -> Dict[str, Any]:
        """
        Convert conversation state + NLP signals into SVI context factors.

        Parameters
        ----------
        conversation_state:
            State maintained by conversation_engine.py.

        nlp_result:
            Optional output from nlp_processor.py.

        Returns
        -------
        Dict[str, Any]:
            Context factors compatible with svi_engine.py.
        """

        state = conversation_state or {}

        collected = state.get(
            "collected_information",
            {}
        )

        context = {}

        # ----------------------------------------------------------
        # 1. Repeat harassment
        # ----------------------------------------------------------

        if "repeat_harassment" in collected:
            context["is_repeat_harassment"] = self._is_yes(
                collected["repeat_harassment"]
            )

        # ----------------------------------------------------------
        # 2. Police FIR refusal
        # ----------------------------------------------------------

        if "police_fir_refused" in collected:
            context["police_fir_refused"] = self._is_yes(
                collected["police_fir_refused"]
            )

        # ----------------------------------------------------------
        # 3. Perpetrator in position of power
        # ----------------------------------------------------------

        if "perpetrator_in_power" in collected:
            context["perpetrator_in_power"] = self._is_yes(
                collected["perpetrator_in_power"]
            )

        # ----------------------------------------------------------
        # 4. Immediate safety
        #
        # Your SVI engine doesn't currently have an
        # "immediate_danger" factor, so we preserve it
        # separately for downstream logic.
        # ----------------------------------------------------------

        if "immediate_safety" in collected:
            context["immediate_danger"] = self._is_yes(
                collected["immediate_safety"]
            )

        # ----------------------------------------------------------
        # 5. Perpetrator nearby
        # ----------------------------------------------------------

        if "perpetrator_nearby" in collected:
            context["perpetrator_nearby"] = self._is_yes(
                collected["perpetrator_nearby"]
            )

        # ----------------------------------------------------------
        # 6. Suicidal ideation
        #
        # Prefer the NLP result because this is automatically
        # detected from the user's narrative.
        # ----------------------------------------------------------

        suicidal_flag = False

        if nlp_result:
            entities = nlp_result.get(
                "entities",
                {}
            )

            suicidal_flag = bool(
                entities.get(
                    "has_suicidal_flag",
                    False
                )
            )

        context["has_suicidal_flag"] = suicidal_flag

        # ----------------------------------------------------------
        # 7. Preserve support preference
        # ----------------------------------------------------------

        if "support_needed" in collected:
            context["support_needed"] = collected[
                "support_needed"
            ]

        return context

    # --------------------------------------------------------------
    # Helper
    # --------------------------------------------------------------

    @staticmethod
    def _is_yes(value: Any) -> bool:
        """
        Convert common chatbot responses into a boolean.
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


# Singleton instance
context_mapper = ConversationContextMapper()