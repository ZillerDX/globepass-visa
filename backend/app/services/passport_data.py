import os
import json
from typing import Dict, List, Optional, Any

class PassportDataService:
    def __init__(self):
        self._countries: List[Dict[str, Any]] = []
        self._countries_by_code: Dict[str, Dict[str, Any]] = {}
        self._matrix: Dict[str, Dict[str, Any]] = {}
        self._load_data()

    def _load_data(self):
        base_dir = os.path.dirname(os.path.dirname(__file__))
        seed_dir = os.path.join(base_dir, "seed")
        
        countries_path = os.path.join(seed_dir, "countries.json")
        matrix_path = os.path.join(seed_dir, "passport_matrix.json")
        
        if os.path.exists(countries_path):
            with open(countries_path, "r", encoding="utf-8") as f:
                self._countries = json.load(f)
                self._countries_by_code = {c["code"]: c for c in self._countries}
        
        if os.path.exists(matrix_path):
            with open(matrix_path, "r", encoding="utf-8") as f:
                self._matrix = json.load(f)

    def get_all_countries(self) -> List[Dict[str, Any]]:
        return self._countries

    def get_country(self, code: str) -> Optional[Dict[str, Any]]:
        return self._countries_by_code.get(code.upper())

    def get_quick_requirement(self, from_code: str, to_code: str) -> Optional[Dict[str, Any]]:
        from_code = from_code.upper()
        to_code = to_code.upper()
        pair_key = f"{from_code}_{to_code}"
        
        if pair_key in self._matrix:
            data = self._matrix[pair_key]
            return {
                "from_country": from_code,
                "to_country": to_code,
                "visa_type": data.get("visa_type", "embassy_visa"),
                "days": data.get("days"),
                "label": data.get("label", "Visa Required"),
                "raw": data.get("raw", "")
            }
        
        # Fallback if pair not in matrix
        return {
            "from_country": from_code,
            "to_country": to_code,
            "visa_type": "embassy_visa",
            "days": None,
            "label": "Embassy Visa Required",
            "raw": "visa required"
        }

passport_service = PassportDataService()
