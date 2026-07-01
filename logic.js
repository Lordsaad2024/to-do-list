const inputTask = document.getElementById("to-do")
const btn = document.getElementById("btn-add")
const tasks = document.getElementById("tasks")
const btnAll = document.getElementById("all-tasks")
const btnComplete = document.getElementById("complete-tasks")
const btnUnComplete = document.getElementById("uncomplete-tasks")

let tasksData = JSON.parse(localStorage.getItem("tasks")) || []

// =====================
// Add Task
// =====================
function addTask() {
    let value = inputTask.value.trim()

    if (value === "") {
        alert("Add a task first")
        return
    }
    let time = new Date().toISOString();
    let taskObj = {
        id: time,
        task: value,
        status: false
    }

    tasksData.push(taskObj)
    saveTasks()
    renderTasks(tasksData)

    inputTask.value = ""
}
// =====================
// Render Tasks (تعديل دالة العرض)
// =====================
function renderTasks(arr) {
    tasks.innerHTML = ""

    arr.forEach(taskObj => {
        let li = document.createElement("li")
        let span = document.createElement("span")
        let small = document.createElement("small")

        li.innerText = taskObj.task
        li.dataset.id = taskObj.id // هنا الـ id بيتخزن كنص في الـ dataset
 
        const taskDate = new Date(taskObj.id);
        // 1. استخراج التاريخ فقط بشكل منظم (يوم/شهر/سنة)
        const datePart = taskDate.toLocaleDateString('en-GB'); // النتيجة: 17/06/2026
        // 2. استخراج الوقت فقط بشكل 12 ساعة (بدون حروف عربية تلخبط السطر)
        const timePart = taskDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // النتيجة: 05:52 PM

        // 3. دمجهم مع بعض بشكل منظم (التاريخ أولاً ثم الوقت، أو العكس حسب رغبتك)
        small.innerText = `${datePart} - ${timePart}`;

        if (taskObj.status) {
            li.classList.add("checked")
        }

        span.innerHTML = "&times;"
        li.append(small, span)
        tasks.append(li)
    })
}

// =====================
// Toggle / Delete (تعديل دالة الضغط والمسح)
// =====================
tasks.addEventListener("click", function (e) {

    if (e.target.tagName === "LI") {
        // 🔥 التعديل هنا: شيلنا ()Number لأن الـ id عبارة عن نص (ISO String)
        let id = e.target.dataset.id 

        tasksData = tasksData.map(task => {
            if (task.id === id) {
                task.status = !task.status
            }
            return task
        })

        saveTasks()
        renderTasks(tasksData)
    }

    else if (e.target.tagName === "SPAN") {
        // 🔥 التعديل هنا أيضاً: شيلنا ()Number ليعمل الحذف بشكل صحيح
        let id = e.target.parentElement.dataset.id 

        tasksData = tasksData.filter(task => task.id !== id)

        saveTasks()
        renderTasks(tasksData)
    }
})
// =====================
// Save LocalStorage
// =====================
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasksData))
}


// =====================
// Buttons
// =====================
btn.addEventListener("click", addTask)

inputTask.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addTask()
    }
})

btnAll.addEventListener("click", function () {
    renderTasks(tasksData)
})

btnComplete.addEventListener("click", function () {
    let completed = tasksData.filter(task => task.status)
    renderTasks(completed)
})

btnUnComplete.addEventListener("click", function () {
    let uncompleted = tasksData.filter(task => !task.status)
    renderTasks(uncompleted)
})


// Initial Load
if (tasksData.length!==0){
     renderTasks(tasksData)
}
