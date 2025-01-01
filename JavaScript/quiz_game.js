document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('question-container');
    const answersContainer = document.getElementById('answers-container');
    const scoreDisplay = document.getElementById('score-display');
    const quizContainer = document.getElementById('quiz-container'); // To display feedback
    let currentQuestionIndex = 0;
    let score = 0;

    function shuffleAnswers(questions) {
        for (let category in questions) {
            questions[category].forEach(question => {
                question.answers = question.answers.sort(() => Math.random() - 0.5);
            });
        }
        return questions;
    }

    const questions = shuffleAnswers({
        Geography: [
            { question: "Which river is the longest in the world?", answers: [{ text: "Nile", correct: true }, { text: "Amazon", correct: false }, { text: "Yangtze", correct: false }, { text: "Mississippi", correct: false }] },
            { question: "Which continent is known as the 'Dark Continent'?", answers: [{ text: "Africa", correct: true }, { text: "Asia", correct: false }, { text: "Australia", correct: false }, { text: "South America", correct: false }] },
            { question: "Which is the smallest country in the world?", answers: [{ text: "Vatican City", correct: true }, { text: "Monaco", correct: false }, { text: "San Marino", correct: false }, { text: "Liechtenstein", correct: false }] },
            { question: "Which desert is the largest in the world?", answers: [{ text: "Sahara", correct: true }, { text: "Gobi", correct: false }, { text: "Kalahari", correct: false }, { text: "Arctic", correct: false }] },
            { question: "What is the capital city of Brazil?", answers: [{ text: "Brasília", correct: true }, { text: "Rio de Janeiro", correct: false }, { text: "São Paulo", correct: false }, { text: "Salvador", correct: false }] }
        ],
        History: [
            { question: "Who was the first President of the United States?", answers: [{ text: "George Washington", correct: true }, { text: "Abraham Lincoln", correct: false }, { text: "Thomas Jefferson", correct: false }, { text: "John Adams", correct: false }] },
            { question: "What year did World War II end?", answers: [{ text: "1945", correct: true }, { text: "1940", correct: false }, { text: "1939", correct: false }, { text: "1950", correct: false }] },
            { question: "Who discovered America?", answers: [{ text: "Christopher Columbus", correct: true }, { text: "Leif Erikson", correct: false }, { text: "Vasco da Gama", correct: false }, { text: "Marco Polo", correct: false }] },
            { question: "Who was the first woman to win a Nobel Prize?", answers: [{ text: "Marie Curie", correct: true }, { text: "Ada Lovelace", correct: false }, { text: "Rosalind Franklin", correct: false }, { text: "Lise Meitner", correct: false }] },
            { question: "What ancient civilization built Machu Picchu?", answers: [{ text: "Inca", correct: true }, { text: "Aztec", correct: false }, { text: "Maya", correct: false }, { text: "Olmec", correct: false }] }
        ],
        Science: [
            { question: "What is the chemical formula for water?", answers: [{ text: "H2O", correct: true }, { text: "O2", correct: false }, { text: "CO2", correct: false }, { text: "NaCl", correct: false }] },
            { question: "Which gas do plants absorb from the atmosphere?", answers: [{ text: "Carbon Dioxide", correct: true }, { text: "Oxygen", correct: false }, { text: "Nitrogen", correct: false }, { text: "Hydrogen", correct: false }] },
            { question: "What is the largest organ in the human body?", answers: [{ text: "Skin", correct: true }, { text: "Liver", correct: false }, { text: "Brain", correct: false }, { text: "Heart", correct: false }] },
            { question: "What is the speed of sound?", answers: [{ text: "343 m/s", correct: true }, { text: "300 m/s", correct: false }, { text: "400 m/s", correct: false }, { text: "500 m/s", correct: false }] },
            { question: "What planet is known as the 'Morning Star'?", answers: [{ text: "Venus", correct: true }, { text: "Mars", correct: false }, { text: "Jupiter", correct: false }, { text: "Saturn", correct: false }] }
        ],
        Literature: [
            { question: "Who wrote 'Pride and Prejudice'?", answers: [{ text: "Jane Austen", correct: true }, { text: "Charlotte Brontë", correct: false }, { text: "Mary Shelley", correct: false }, { text: "Louisa May Alcott", correct: false }] },
            { question: "Who is the author of '1984'?", answers: [{ text: "George Orwell", correct: true }, { text: "Aldous Huxley", correct: false }, { text: "Ray Bradbury", correct: false }, { text: "Jules Verne", correct: false }] },
            { question: "Which famous playwright wrote 'Hamlet'?", answers: [{ text: "William Shakespeare", correct: true }, { text: "Christopher Marlowe", correct: false }, { text: "Ben Jonson", correct: false }, { text: "John Webster", correct: false }] },
            { question: "Who wrote 'The Great Gatsby'?", answers: [{ text: "F. Scott Fitzgerald", correct: true }, { text: "Ernest Hemingway", correct: false }, { text: "William Faulkner", correct: false }, { text: "John Steinbeck", correct: false }] },
            { question: "Which Greek poet is credited with writing 'The Iliad'?", answers: [{ text: "Homer", correct: true }, { text: "Sophocles", correct: false }, { text: "Euripides", correct: false }, { text: "Virgil", correct: false }] }
        ],
        GeneralKnowledge: [
            { question: "Which company created the iPhone?", answers: [{ text: "Apple", correct: true }, { text: "Samsung", correct: false }, { text: "Google", correct: false }, { text: "Microsoft", correct: false }] },
            { question: "What is the capital city of Canada?", answers: [{ text: "Ottawa", correct: true }, { text: "Toronto", correct: false }, { text: "Vancouver", correct: false }, { text: "Montreal", correct: false }] },
            { question: "What is the hardest natural substance on Earth?", answers: [{ text: "Diamond", correct: true }, { text: "Gold", correct: false }, { text: "Platinum", correct: false }, { text: "Iron", correct: false }] },
            { question: "What is the currency of the United Kingdom?", answers: [{ text: "Pound Sterling", correct: true }, { text: "Euro", correct: false }, { text: "Dollar", correct: false }, { text: "Yen", correct: false }] },
            { question: "Which animal is known as the 'King of the Jungle'?", answers: [{ text: "Lion", correct: true }, { text: "Tiger", correct: false }, { text: "Elephant", correct: false }, { text: "Giraffe", correct: false }] }
        ],
        Sports: [
            { question: "How many players are on a soccer team?", answers: [{ text: "11", correct: true }, { text: "9", correct: false }, { text: "7", correct: false }, { text: "15", correct: false }] },
            { question: "What is the only country to have played in every FIFA World Cup?", answers: [{ text: "Brazil", correct: true }, { text: "Germany", correct: false }, { text: "Italy", correct: false }, { text: "Argentina", correct: false }] },
            { question: "Which sport uses the terms 'love' and 'deuce'?", answers: [{ text: "Tennis", correct: true }, { text: "Badminton", correct: false }, { text: "Squash", correct: false }, { text: "Table Tennis", correct: false }] },
            { question: "In which year were the first modern Olympics held?", answers: [{ text: "1896", correct: true }, { text: "1900", correct: false }, { text: "1920", correct: false }, { text: "1912", correct: false }] },
            { question: "Which country has won the most Olympic gold medals?", answers: [{ text: "USA", correct: true }, { text: "China", correct: false }, { text: "Russia", correct: false }, { text: "Germany", correct: false }] }
        ]
    });

    console.log(questions);


    function getQuizQuestions() {
        const quizQuestions = [];
        for (const category in questions) {
            const categoryQuestions = questions[category];
            const randomIndex = Math.floor(Math.random() * categoryQuestions.length);
            quizQuestions.push(categoryQuestions[randomIndex]);
        }
        return quizQuestions;
    }

    let selectedQuestions = getQuizQuestions();

    function loadQuestion() {
        if (currentQuestionIndex >= selectedQuestions.length) {
            alert(`Quiz finished! Your final score is ${score}.`);
            currentQuestionIndex = 0;
            score = 0;
            scoreDisplay.textContent = score;
            selectedQuestions = getQuizQuestions();
            loadQuestion();
            return;
        }

        const currentQuestion = selectedQuestions[currentQuestionIndex];
        questionContainer.innerHTML = `<p>${currentQuestion.question}</p>`;
        answersContainer.innerHTML = "";

        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.addEventListener('click', () => {
                if (answer.correct) {
                    score += 10;
                    showFeedback(true); // Show positive feedback
                }
                else {
                    showFeedback(false); // Show negative feedback
                }
                scoreDisplay.textContent = score;
                currentQuestionIndex++;
                setTimeout(() => loadQuestion(), 1500); // Load next question after feedback
            });
            answersContainer.appendChild(button);
        });
    }
    function showFeedback(isCorrect) {
        const feedbackDiv = document.createElement('div');
    
        // Feedback styling
        feedbackDiv.style.marginTop = '20px'; // Space above the feedback
        feedbackDiv.style.background = isCorrect ? 'rgba(0, 255, 0, 0.8)' : 'rgba(255, 0, 0, 0.8)';
        feedbackDiv.style.padding = '10px'; // Thinner feedback
        feedbackDiv.style.borderRadius = '5px';
        feedbackDiv.style.color = 'white';
        feedbackDiv.style.fontSize = '1.2em'; // Slightly smaller font
        feedbackDiv.style.textAlign = 'center';
        feedbackDiv.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.2)';
    
        // Dynamically match the width of the answer buttons
        const answerButton = answersContainer.querySelector('button');
        if (answerButton) {
            feedbackDiv.style.width = 'calc(100% - 20px)'; // Set feedback width to match answer width
            feedbackDiv.style.marginLeft = 'auto'; // Center-align the feedback
            feedbackDiv.style.marginRight = 'auto';
        }
    
        const emoji = isCorrect ? '😊' : '😢';
        const message = isCorrect ? 'Great Job!' : 'Better luck next time!';
    
        feedbackDiv.innerHTML = `<div>${emoji} ${message}</div>`;
    
        // Append feedback to the answers container (below the answers)
        answersContainer.appendChild(feedbackDiv);
    
        setTimeout(() => feedbackDiv.remove(), 1500); // Remove feedback after 1.5 seconds
    }
    


    loadQuestion();

    window.goBack = () => {
        window.location.href = '/HTML/home_page.html';
    };
});
