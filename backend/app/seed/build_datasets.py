import urllib.request
import csv
import json
import os
from country_mapping import COUNTRY_MAPPING

def get_flag_emoji(country_code: str) -> str:
    """Returns flag emoji from ISO-2 country code."""
    if len(country_code) != 2:
        return ""
    return "".join(chr(127397 + ord(c)) for c in country_code.upper())

def normalize_requirement(req_str: str):
    req = req_str.strip().lower()
    days = None
    
    if req.isdigit():
        return "visa_free", int(req), f"Visa Free ({req} days)"
    elif "visa free" in req:
        return "visa_free", None, "Visa Free"
    elif "visa on arrival" in req or "voa" in req:
        return "visa_on_arrival", None, "Visa on Arrival"
    elif "e-visa" in req or "evisa" in req or "eta" in req:
        return "evisa", None, "eVisa / ETA"
    elif "visa required" in req:
        return "embassy_visa", None, "Embassy Visa Required"
    elif "no admission" in req:
        return "no_admission", None, "No Admission"
    elif req == "-1":
        return "domestic", None, "Domestic / Same Country"
    else:
        return "embassy_visa", None, req_str

def main():
    print("Fetching passport index dataset...")
    url = "https://raw.githubusercontent.com/ilyankou/passport-index-dataset/master/passport-index-tidy.csv"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    
    csv_text = ""
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            csv_text = resp.read().decode("utf-8")
        print("Successfully downloaded CSV from GitHub.")
    except Exception as e:
        print("Network fetch failed, attempting local fallback if exists:", e)
        local_csv = os.path.join(os.path.dirname(__file__), "passport-index-tidy.csv")
        if os.path.exists(local_csv):
            with open(local_csv, "r", encoding="utf-8") as f:
                csv_text = f.read()
        else:
            raise

    # Also save raw copy locally for offline reliability
    raw_path = os.path.join(os.path.dirname(__file__), "passport-index-tidy.csv")
    with open(raw_path, "w", encoding="utf-8") as f:
        f.write(csv_text)

    # Build countries list (deduplicated by ISO-2 code)
    seen_iso = set()
    countries_list = []
    iso_by_name = {}
    for name, info in COUNTRY_MAPPING.items():
        iso = info["iso2"]
        iso_by_name[name.lower()] = iso
        if iso not in seen_iso:
            seen_iso.add(iso)
            countries_list.append({
                "code": iso,
                "name_en": info["name_en"],
                "name_th": info["name_th"],
                "flag": get_flag_emoji(iso)
            })

    # Sort countries by English name
    countries_list.sort(key=lambda c: c["name_en"])

    # Parse matrix
    reader = csv.reader(csv_text.strip().splitlines())
    header = next(reader)
    
    matrix = {}
    matched_count = 0
    unmatched_pairs = 0

    for row in reader:
        if len(row) < 3:
            continue
        p_name, d_name, req = row[0].strip(), row[1].strip(), row[2].strip()
        p_iso = iso_by_name.get(p_name.lower())
        d_iso = iso_by_name.get(d_name.lower())
        
        if p_iso and d_iso:
            vtype, days, label = normalize_requirement(req)
            pair_key = f"{p_iso}_{d_iso}"
            matrix[pair_key] = {
                "visa_type": vtype,
                "days": days,
                "label": label,
                "raw": req
            }
            matched_count += 1
        else:
            unmatched_pairs += 1

    print(f"Parsed {matched_count} country pairs into matrix. Unmatched: {unmatched_pairs}")

    # Output paths
    seed_dir = os.path.dirname(__file__)
    countries_json_path = os.path.join(seed_dir, "countries.json")
    matrix_json_path = os.path.join(seed_dir, "passport_matrix.json")

    with open(countries_json_path, "w", encoding="utf-8") as f:
        json.dump(countries_list, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(countries_list)} countries to {countries_json_path}")

    with open(matrix_json_path, "w", encoding="utf-8") as f:
        json.dump(matrix, f, ensure_ascii=False)
    print(f"Saved matrix to {matrix_json_path}")

    # Also sync directly to frontend data directory
    frontend_data_dir = os.path.abspath(os.path.join(seed_dir, "../../../frontend/src/lib/data"))
    os.makedirs(frontend_data_dir, exist_ok=True)
    with open(os.path.join(frontend_data_dir, "countries.json"), "w", encoding="utf-8") as f:
        json.dump(countries_list, f, ensure_ascii=False, indent=2)
    with open(os.path.join(frontend_data_dir, "passport_matrix.json"), "w", encoding="utf-8") as f:
        json.dump(matrix, f, ensure_ascii=False)
    print(f"Synchronized countries and matrix to frontend data folder: {frontend_data_dir}")

if __name__ == "__main__":
    main()
