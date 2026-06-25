# Group Project - Community-Support-Tracker

## Description

This web application is a tracker for PiXELL's River Community Support. We can track donation,
volunteer hours and event signups in which PiXELL's River employees participated.

## Authors - Team Members

- Maximilian Kreuser
- Ben Luka
- Daniel Oyebadejo

## Date

2026-06-24

## Project Overview - what your code does

To keep track of our community support, we have 3 forms, one for each categories (donation,
volunteer hours, event signups). Each form has there own page and can be navigated to from
any other pages. Trought the form we collect different values, verify they are valid and store
them in the localStorage of the browser. If the values are invalid we message the user of the
error. Each form pages then displays below the form in a table the data collected inside the
localStorage. This table as a delete function for each set of data so you can remove any
unwanted information. The webpage is also adjusted for mobile use.

## Member Contributions

### Maximilian Kreuser

- volunteer.html
- volunteerscript.js
- volunteerscript.test.js
- styles.css - error message, mobile navigation, main tag section
- script.js
- README.md
- GitHub Issues & Action (testing.yml)

### Ben Luka

- events.html
- eventscript.js
- eventscript.test.js
- styles.css - html template styles (header, navigation, footer, buttons), form styles
- Jest and Node configuration
- STYLE_GUIDE.md
- Github Rulesets

### Daniel Oyebadejo

- donations.html
- donations.js
- donations.test.js
- index.html - template
- images folder content
