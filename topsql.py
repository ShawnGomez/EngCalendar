import psycopg

def save(assignments):

    #Connecting to local db
    conn =psycopg.connect(
        host = "localhost",
        dbname = "assignments_db",
        user = "postgres",
        password = "password",
        port = 5432
    )

    print("Connected")

    cur = conn.cursor()

    cur.execute("SELECT current_database();")

    print(cur.fetchone())

    #Adding every assignment to db
    for assignment in assignments:

        cur.execute("""
            INSERT INTO assignments
            (
                course_name,
                assignment_title,
                due_date,
                url,
                description
            )
            VALUES (%s, %s, %s, %s, %s)
        """, (
            assignment["course_name"],
            assignment["name"],
            assignment["due_date"],
            assignment["url"],
            assignment["description"]
        ))

    # Save
    conn.commit()

    # Closing
    cur.close()
    conn.close()