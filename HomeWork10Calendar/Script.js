const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)
}
FebDays = (year) => {
    return isLeapYear(year) ? 29 : 28
}

let calendar = document.querySelector('.calendar')
let clear = document.getElementById('clearButton')


generateCalender = (month, year) => {   
    let calendar_days = calendar.querySelector('.calendar-days')
    let calendar_year = calendar.querySelector('#year')
    let calendar_month = [31, FebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    calendar_days.innerHTML = ''
    

    let curDate = new Date()
    if (!month) month = curDate.getMonth()
    if (!year) year = curDate.getFullYear()
    let cur_month = `${month_names[month]}`
    month_picker.innerHTML = cur_month
    calendar_year.innerHTML = year

    let first_day = new Date(year, month, 1)
    let lastDayOfPreviousMonth = new Date(year, month, 0).getDate();

    let eventData = getEventData();
    let events = eventData.events;

    for (let i = 0; i < calendar_month[month] + first_day.getDay(); i++) {
        let day = document.createElement('div');
        let dayNumber;

        if (i < first_day.getDay()) {
            // 上個月的日期
            day.classList.add('previous-month-day');
            dayNumber = lastDayOfPreviousMonth - (first_day.getDay() - i) + 1;
            let dayNumberBox = document.createElement('div');
            dayNumberBox.innerHTML = dayNumber
            day.appendChild(dayNumberBox)
        } else {
            // 本月的日期
            day.classList.add('calendar-day');
            dayNumber = i - first_day.getDay() + 1;
            let dayNumberBox = document.createElement('div');
            dayNumberBox.innerHTML = dayNumber
            dayNumberBox.classList.add('numberBox')
            dayNumberBox.setAttribute('data-bs-toggle', 'modal');
            dayNumberBox.setAttribute('data-bs-target', '#exampleModal');
            day.appendChild(dayNumberBox)
        }
        if (dayNumber === curDate.getDate() && year === curDate.getFullYear() && month === curDate.getMonth()) {
            day.classList.add('cur-date');
        }
        
        calendar_days.appendChild(day);
        // 为每个存储的日期添加一个div
        events.forEach(event => {
            const storedDate = new Date(event.date);
            if (dayNumber === storedDate.getDate() && month === storedDate.getMonth() && year === storedDate.getFullYear()) {
                let storedEventInfo = document.createElement('div');
                storedEventInfo.innerHTML = `<span class="event-title" style="color: ${event.color};">${event.title}</span>`;
                day.appendChild(storedEventInfo);
            }
        });
    }
}

let month_list = calendar.querySelector('.month-list')

month_names.forEach((e, index) => {
    let month = document.createElement('div')
    month.innerHTML = `<div data-month="${index}">${e}</div>`
    month.querySelector('div').onclick = () => {
        month_list.classList.remove('show')
        cur_month.value = index
        generateCalender(index, cur_year.value)
    }
    month_list.appendChild(month)
})

let month_picker = calendar.querySelector('#month-picker')

month_picker.onclick = () => {
    month_list.classList.add('show')
}


let curDate = new Date()
let cur_month = { value: curDate.getMonth() }
let cur_year = { value: curDate.getFullYear() }

generateCalender(cur_month.value, cur_year.value)

document.querySelector('#pre-year').onclick = () => {
    --cur_year.value
    generateCalender(cur_month.value, cur_year.value)
}

document.querySelector('#next-year').onclick = () => {
    ++cur_year.value
    generateCalender(cur_month.value, cur_year.value)
}

let saveButton = document.getElementById("saveButton");
let deleteButton = document.getElementById("deleteButton")

saveButton.addEventListener("click",function(){
    const eventId = document.getElementById('eventId').value
    const eventColor = document.getElementById('eventColor').value;
    const eventDay = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventTitle = document.getElementById('eventTitle').value;
    const eventDescription = document.getElementById('eventDescription').value;

    let eventData = getEventData();

    if (!eventId) {
        // 添加新事件
        // 組合為 JSON 對象
        let newEvent = {
            // 使用當前時間戳作為 ID
            "id": Date.now(),
            "color": eventColor,
            "date": eventDay,
            "time": eventTime,
            "title": eventTitle,
            "description": eventDescription
        };

        eventData.events.push(newEvent);
    } else {
        // 編輯現有事件
        const foundEvent = eventData.events.find((eData) => {
            return eData.id == eventId;
        });
        foundEvent.color = eventColor;
        foundEvent.date = eventDay;
        foundEvent.time = eventTime;
        foundEvent.title = eventTitle;
        foundEvent.description = eventDescription;
    }
    saveEventData(eventData);
    document.getElementById('closeButton').click();
    window.location.reload();
})

function getEventData(){
    let eventData = localStorage.getItem('events');
    return eventData ? JSON.parse(eventData) : {events:[]};
}

function saveEventData(eventData){
    localStorage.setItem('events',JSON.stringify(eventData))
}


clearButton.addEventListener('click', function () {
    localStorage.clear();
    window.location.reload();
});