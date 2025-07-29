# STEP 2: main.py — App Entry and User Interface (Terminal)

from db import setup_db, add_user, add_doubt, get_unsolved_doubts, solve_doubt, get_leaderboard

def menu():
    print("==========================")
    print(" Welcome to Vfriends App!")
    print("==========================")

    name = input("Enter your name: ")
    role = input("Are you a Doubt Asker or Solver? (asker/solver): ").strip().lower()

    if role not in ['asker', 'solver']:
        print("Invalid role. Please restart and type 'asker' or 'solver'.")
        return

    user_id = add_user(name, role)

    if role == 'asker':
        question = input("\nEnter your doubt/question: ")
        add_doubt(question, user_id)
        print("\n✅ Your doubt has been posted. A solver will help you soon!")

    elif role == 'solver':
        doubts = get_unsolved_doubts()
        if not doubts:
            print("\n📭 No doubts available at the moment. Come back later!")
            return

        print("\n📝 Available Doubts:")
        for d in doubts:
            print(f"ID {d[0]}: {d[1]}")

        try:
            doubt_id = int(input("\nEnter the ID of the doubt you want to solve: "))
            solve_doubt(doubt_id, user_id)
            print("\n🎉 You solved a doubt and earned 10 points!")
        except:
            print("❌ Invalid input. Please enter a valid ID.")

    print("\n🏆 Leaderboard (Top 5 Users):")
    leaderboard = get_leaderboard()
    for i, user in enumerate(leaderboard, 1):
        print(f"{i}. {user[0]} | Points: {user[1]} | Streak: {user[2]} 🔥")

if __name__ == '__main__':
    setup_db()
    menu()
