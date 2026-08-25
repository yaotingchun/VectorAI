import os
import json
import requests
from google.oauth2 import service_account
import google.auth.transport.requests

def parse_firestore_value(val_obj):
    if not isinstance(val_obj, dict):
        return val_obj
    
    key = list(val_obj.keys())[0]
    raw_val = val_obj[key]
    
    if key == "stringValue":
        return str(raw_val)
    elif key == "integerValue":
        return int(raw_val)
    elif key == "doubleValue":
        return float(raw_val)
    elif key == "booleanValue":
        return bool(raw_val)
    elif key == "arrayValue":
        values = raw_val.get("values", [])
        return [parse_firestore_value(v) for v in values]
    elif key == "mapValue":
        fields = raw_val.get("fields", {})
        return {k: parse_firestore_value(v) for k, v in fields.items()}
    elif key == "nullValue":
        return None
    return raw_val

def parse_firestore_fields(fields_dict):
    return {k: parse_firestore_value(v) for k, v in fields_dict.items()}

def main():
    workspace_dir = "c:/Users/nguxi/Downloads/VectorAI"
    firebase_json_path = os.path.join(workspace_dir, "credentials/firebase.json")
    output_dir = os.path.join(workspace_dir, "src/data")
    output_json_path = os.path.join(output_dir, "machines.json")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    print("Loading credentials...")
    creds = service_account.Credentials.from_service_account_file(
        firebase_json_path,
        scopes=["https://www.googleapis.com/auth/cloud-platform"]
    )
    
    req = google.auth.transport.requests.Request()
    creds.refresh(req)
    access_token = creds.token
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    firestore_url = "https://firestore.googleapis.com/v1/projects/vectorai-506214/databases/(default)/documents/machines"
    print("Querying Firestore...")
    res = requests.get(firestore_url, headers=headers)
    
    if res.status_code != 200:
        print("Error fetching from Firebase:", res.text)
        return
    
    data = res.json()
    documents = data.get("documents", [])
    
    parsed_machines = []
    for doc in documents:
        fields = doc.get("fields", {})
        parsed_fields = parse_firestore_fields(fields)
        parsed_machines.append(parsed_fields)
        
    print(f"Successfully parsed {len(parsed_machines)} machines.")
    
    # Save to src/data/machines.json
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(parsed_machines, f, indent=2)
        
    print("Saved parsed machines to:", output_json_path)

if __name__ == "__main__":
    main()
