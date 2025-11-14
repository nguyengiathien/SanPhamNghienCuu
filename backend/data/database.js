
// SQL
{
    ["user"] = {
        "user_id": int,
        "username": Text,
        "password": Text,
        "fullname": Text,
        "email": Text,
        "phonenumber": Text,
        "role": Text,
    },
    ["course"] = {
        "course_id": int,
        "course_name": Text,
        "course_description": Text,
        "price": float,
        "creator": user_id,
        "lessons": [
        ],
        "attendants": [

        ],
        "rate": float,
        "rate_number": int,
        "rate_content": [

        ]
    },
    ["class"] = {
        "class_id": int,
        "class_name": Text,
        "creator": user_id,
        
    }
}

