from typing import Dict, Any, List

class RecommendationEngine:
    """
    Automated Recommendation Engine for NHAA 14566.
    Rule + ML decision matrix mapping SVI risk score & detected trauma flags
    to the 6 government support verticals with transparent rationale.
    """
    def __init__(self):
        pass

    def generate_recommendations(self, svi_data: Dict[str, Any], nlp_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        svi_score = svi_data.get("svi_score", 0.0)
        risk_category = svi_data.get("risk_category", "LOW")
        categories = nlp_data.get("detected_categories", [])
        trauma_flags = nlp_data.get("trauma_flags", [])
        has_suicidal = "suicidal_ideation" in categories

        recommendations = []

        # 1. Police & Emergency Intervention
        if risk_category in ["CRITICAL", "HIGH"] or "intimidation_threats" in categories or "violence_assault" in categories:
            recommendations.append({
                "vertical": "Emergency Police Intervention",
                "agency": "District Police Control Room & 112 Dispatch",
                "priority": "CRITICAL" if risk_category == "CRITICAL" else "HIGH",
                "action_item": "Dispatch immediate police escort / Station House Officer to victim location under SC/ST PoA Act Sec 15A.",
                "why": "High physical danger, death threat, or active violence detected in intake narrative."
            })

        # 2. Counselling & Psychological Support
        if has_suicidal or risk_category in ["CRITICAL", "HIGH", "MODERATE"]:
            recommendations.append({
                "vertical": "Psychological Counselling",
                "agency": "NHAA Tele-Mental Health Specialist / District Counsellor",
                "priority": "CRITICAL" if has_suicidal else "HIGH",
                "action_item": "Immediate 1-on-1 trauma-informed counselling session. Crisis hotline connection.",
                "why": "Elevated trauma index & psychological distress biomarkers identified."
            })

        # 3. Witness & Victim Protection
        if "intimidation_threats" in categories or "displacement_isolation" in categories or svi_score > 60:
            recommendations.append({
                "vertical": "Witness & Victim Protection",
                "agency": "State SC/ST Protection Cell & District Magistrate",
                "priority": "HIGH",
                "action_item": "Provide secure safe-house relocation and perimeter protection under Witness Protection Scheme 2018.",
                "why": "Accused intimidation or threat of witness tampering detected."
            })

        # 4. Legal Aid & FIR Registration Support
        if "caste_discrimination" in categories or "displacement_isolation" in categories or risk_category != "LOW":
            recommendations.append({
                "vertical": "Free Legal Aid & Prosecution Support",
                "agency": "District Legal Services Authority (DLSA) & Special Public Prosecutor",
                "priority": "HIGH" if risk_category in ["CRITICAL", "HIGH"] else "ROUTINE",
                "action_item": "Assign dedicated advocate for FIR drafting under SC/ST PoA Act 1989 and Special Court proceedings.",
                "why": "Legal rights violation and systemic administrative grievance identified."
            })

        # 5. Medical Assistance & Forensic Documentation
        if "violence_assault" in categories or "sexual_violence" in categories:
            recommendations.append({
                "vertical": "Medical Care & MLC Documentation",
                "agency": "District Civil Hospital & District Medical Officer",
                "priority": "CRITICAL",
                "action_item": "Arrange immediate medical treatment, medico-legal examination (MLC), and trauma recovery care.",
                "why": "Physical assault or injury reported in complaint narrative."
            })

        # 6. Social Welfare & Immediate Financial Relief Grant
        if "displacement_isolation" in categories or risk_category in ["CRITICAL", "HIGH", "MODERATE"]:
            recommendations.append({
                "vertical": "Relief & Rehabilitation Fund",
                "agency": "Department of Social Justice & Empowerment (MoSJE) / District Collector",
                "priority": "HIGH",
                "action_item": "Sanction immediate interim financial relief grant (per SC/ST PoA Amendment Rules Schedule I) and temporary shelter.",
                "why": "Social boycott, eviction, or economic hardship resulting from atrocity."
            })

        return recommendations

recommendation_engine = RecommendationEngine()
