import ProfileFinder
#Import of selenium for crawling 
from selenium import webdriver
from selenium.webdriver.common.by import By
#import options to specify what to open
from selenium.webdriver.chrome.options import Options
#import time for timers
import time
import subprocess
options = Options()
import os
os.system("taskkill /f /im chrome.exe >nul 2>&1")


from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait

#path to appdata -> local
local_appdata = os.getenv("LOCALAPPDATA")

with open("UserData.txt", "r") as file:
    for line in file:
        line = line.strip()
if line[1]=="Opera":
    browserPath=os.path.join(os.getenv("LOCALAPPDATA"),"Opera Software","Opera GX Stable")
elif line[1]=="Chrome":
    browserPath=os.path.join(os.getenv("LOCALAPPDATA"),"Google","Chrome","User Data")
    options.binary_location =os.path.join(os.getenv("APPDATA"),"Microsoft","Windows","Start Menu","Programs")
elif line[1]=="Brave":
    browserPath=os.path.join(os.getenv("LOCALAPPDATA"),"BraveSoftware","Brave-Browser","User Data")
elif line[1]=="Microsoft Edge":
    browserPath=os.path.join(os.getenv("LOCALAPPDATA"),"Microsoft","Edge","User Data")
    


# path to Opera executable
options.binary_location = r"C:\ProgramData\Microsoft\Windows\Start Menu\Programs" # location of chrome and all other executables (like edge)
chrome_path=r"C:\ProgramData\Microsoft\Windows\Start Menu\Programs"

options.add_argument(r"user-data-dir=C:\Users\ejlok\AppData\Local\Google\Chrome\User Data") # add_argument to specify particular variable, like user-data-dir=
LoggedInProfiles = []
# profile-directory selects the specific profile
for i in ProfileFinder.matches:
    options = Options() # this is to prevent stacking of profiles
    print(r"profile-directory="+i)
    options.add_argument(r"profile-directory="+i)  # add_argument to specify particular variable, like profile-directory= your pfogile

    driver = webdriver.Chrome(options=options) #specify the browser you're using

    driver.implicitly_wait(5) #wait to load the window


    #go to right window
    original_window = driver.current_window_handle

    driver.execute_script("window.open('https://westernu.brightspace.com/d2l/home');")
    # Loop through all open windows/tabs
    for handle in driver.window_handles[::-1]:
        driver.switch_to.window(handle)  # switch Selenium to this window
        if "westernu.brightspace" in driver.current_url:
            print(f"Found Brightspace window")
            break  # stop after finding it
        
    submit_buttons = driver.find_elements(By.XPATH, "//button[contains(text(), 'Log in with your Western account')]")
    current_url =driver.current_url 
    if (current_url!="https://westernu.brightspace.com/d2l/home"):
        submit_buttons[0].click()
    submit_buttons = driver.find_elements(By.ID, "i0116")
    
    if submit_buttons:
          # click the first one
        print("Login needed :(, profile " + str(i))
    else:
        LoggedInProfiles.append(i)
        print("Profile " + str(i) + " is logged in")
        
    driver.close()
    driver.quit()
print(LoggedInProfiles)