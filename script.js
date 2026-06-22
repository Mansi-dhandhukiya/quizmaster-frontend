let quizId = null;
let questions = [];

const BASE_URL = "quizmaster-app-production-a9fd.up.railway.app";

function getAuthHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    };
}

function addQuestion() {
    let title = document.getElementById("title").value.trim();
    let opt1 = document.getElementById("opt1").value.trim();
    let opt2 = document.getElementById("opt2").value.trim();
    let opt3 = document.getElementById("opt3").value.trim();
    let opt4 = document.getElementById("opt4").value.trim();
    let answer = document.getElementById("answer").value.trim();
    let category = document.getElementById("category").value.trim();
    let difficulty = document.getElementById("difficulty").value.trim();

    let msg = document.getElementById("msg");

    if (!title || !opt1 || !opt2 || !opt3 || !opt4 || !answer || !category || !difficulty) {
        msg.style.color = "red";
        msg.innerText = "All fields are required!";
        return;
    }

    if (![opt1, opt2, opt3, opt4].includes(answer)) {
        msg.style.color = "red";
        msg.innerText = "Answer must match one of the options!";
        return;
    }

    let data = {
        questionTitle: title,
        option1: opt1,
        option2: opt2,
        option3: opt3,
        option4: opt4,
        rightAnswer: answer,
        category: category,
        difficultyLevel: difficulty
    };

    fetch(`${BASE_URL}/question/add`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
    })
    .then(res => res.text())
    .then(msg => {
        document.getElementById("msg").innerText = msg;
    });
}

function createQuiz() {
    let category = document.getElementById("category").value;
    let numQ = document.getElementById("numQ").value;
    let title = document.getElementById("title").value;

    fetch(`${BASE_URL}/quiz/create?category=${category}&numQ=${numQ}&title=${title}`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(id => {
        quizId = id;
        alert("Quiz created! ID: " + id);
        loadQuestions();
    });
}

function loadQuestions() {
    fetch(`${BASE_URL}/quiz/get/${quizId}`)
        .then(res => res.json())
        .then(data => {
            questions = data;
            displayQuestions();
        });
}

function displayQuestions() {
    let quizDiv = document.getElementById("quiz");
    quizDiv.innerHTML = "";

    questions.forEach((q) => {
        let div = document.createElement("div");
        div.classList.add("question");

        div.innerHTML = `
            <h3>${q.questionTitle}</h3>
            <label><input type="radio" name="q${q.id}" value="${q.option1}"> ${q.option1}</label><br>
            <label><input type="radio" name="q${q.id}" value="${q.option2}"> ${q.option2}</label><br>
            <label><input type="radio" name="q${q.id}" value="${q.option3}"> ${q.option3}</label><br>
            <label><input type="radio" name="q${q.id}" value="${q.option4}"> ${q.option4}</label>
        `;

        quizDiv.appendChild(div);
    });
}

function submitQuiz() {
    let responses = [];

    questions.forEach(q => {
        let selected = document.querySelector(`input[name="q${q.id}"]:checked`);
        if (selected) {
            responses.push({
                id: q.id,
                response: selected.value
            });
        }
    });

    fetch(`${BASE_URL}/quiz/submit/${quizId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responses)
    })
    .then(res => res.text())
    .then(result => {
        document.getElementById("result").innerText = result;
    });
}