# browser_selector.py
import tkinter as tk

# Global variable to store the user's selection
selected_browser = None

def choose_browser(browser_name):
    global selected_browser
    selected_browser = browser_name
    root.destroy()  # Close the popup window

# Create the main window
root = tk.Tk()
root.title("Select Your Browser")
root.geometry("300x200")
root.resizable(False, False)

# Instruction label
label = tk.Label(root, text="Which browser are you using?", font=("Arial", 12))
label.pack(pady=20)

# Buttons for each browser
browsers = ["Opera", "Brave", "Microsoft Edge", "Chrome"]
for browser in browsers:
    button = tk.Button(root, text=browser, width=20, command=lambda b=browser: choose_browser(b))
    button.pack(pady=5, fill="y", padx=20)
    button.pack(pady=5)

# Start the Tkinter event loop
root.mainloop()

# Print the selection (optional)
print(f"User selected: {selected_browser}")
with open("UserData.txt", "r") as file:
    lines = file.readlines()
if len(lines)<98:
    for i in range(0,99):
        lines.append("\n")
# Replace line 1 (index 0)
lines[0] = "Current browser: \n"
lines[1] =  selected_browser

with open("UserData.txt", "w") as file:
    file.writelines(lines)