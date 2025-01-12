# **RollCall**

This project was developed as part of the "Software Design" course. RollCall is a web application designed to streamline daily planning by automatically generating personalized daily reports based on Google Calendar data. Built with Flask for the backend and React for the frontend, the app integrates with the Google Calendar API to provide insights into meetings, tasks, and schedules.

##### Features
- **Automated Reports**: Generate daily, weekly, and ~monthly reports that prioritize events based on importance and urgency.  
- **Calendar Integration**: Sync seamlessly with Google Calendar for real-time updates.  
- **Customizable Preferences**: Adjust prioritization settings by choosing the method by which you like to prioritize your Google calendar events. Options include:  
  - Key words: Add custom keywords to set prioritization.  
  - Event color: Set event prioritization based on the color of events in your Google calendar.
  - Calendar: Assign prioritization based on each of your Google Calendars. 
- **Daily To-Do List**: Provides helpful suggestions on tasks to focus on, tailored to your schedule.  
-  **Share Reports**: Share you Roll Call with others by emailing them an easy to read version.

# 🎉 [Live Demo](https://project-roll-call.vercel.app/) 🎉


## Tech Stack

#### Frontend:
- **React**: front-end JavaScript library
- **TypeScript**: JavaScript with static typing
- **Vite**: JavaScript package bundler

#### Backend:
- **Python**: high-level programming language
- **Flask**: web server framework for Python
- **MongoDB**: NoSQL document database platform

#### Deployment
- **Render**: Hosts the backend
- **Vercel**: Hosts the frontend

## Motivation

*Google Calendar is one of the most popular tools for staying organized and tracking deadlines, but have you ever found yourself surprised by tasks, even though they were on your schedule? That's because a calendar is only as useful as the effort you put into reviewing and deciphering it. RollCall takes that mental load off your plate by summarizing your day for you, so you can stay productive and on top of your tasks without constantly managing your schedule.*

**PROBLEM**

People with busy schedules (professionals, students, etc.) often struggle to stay organized, especially when managing multiple tasks and meetings. Traditional daily stand-ups or personal check-ins require manual effort, and there’s no easy, automated way to generate a summary of daily tasks and priorities from a calendar.

**WHY IT EXISTS?**

This is a problem because we either:
- Believe if we have it written down, it will get done
- Are too busy with our actual tasks that we don't have time to think about how to efficiently get them done

**SOLUTION**

RollCall will automatically generate a daily roll-call or stand-up report based on an individual's Google Calendar. The app will summarize meetings, tasks, and even suggest a personal TODO all without manual input.


## Installation

###### NOTE
If installing on your machine you will not have access to the database or codebase secrets. The following is only an example of how this e-store can be ran locally.

#### Running on your Machine

```
git clone https://github.com/KarolinaTchiling/project-roll-call.git
```

##### Frontend

1. Install node.js https://nodejs.org/en/download/prebuilt-installer

2. Install dependencies
```
cd frontend
npm install
```

3. Run Frontend
```
npm run dev
```

##### Backend
1. Install python https://www.python.org/downloads

2. Create and activate the virtual environment
```
cd backend
python -m venv venv
```

On Windows:
```
venv\Scripts\activate
```

On MacOS/Linux:
```
source venv/bin/activate
```

3. Install dependencies
```
pip install -r requirements.txt
```

4. Set Up Your Own Environment Variables


5. Start the Server
```
python run.py
```



