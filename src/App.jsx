import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "./data/data";

export default function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // สถานะเรียนคำศัพท์
  const [learningIndex, setLearningIndex] = useState(0);
  const [isLearningDone, setIsLearningDone] = useState(false);

  // แบบฝึกเติมคำ
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [blankedWord, setBlankedWord] = useState("");

  // แสดงบอร์ดคะแนน
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [scoreboardData, setScoreboardData] = useState({});

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (!user) {
      navigate("/");
    } else {
      setUsername(user);
    }
    loadScoreboard();
  }, [navigate]);

  // โหลดบอร์ดคะแนนจาก localStorage
  const loadScoreboard = () => {
    const data = localStorage.getItem("scoreboard");
    if (data) {
      setScoreboardData(JSON.parse(data));
    }
  };

  // บันทึกคะแนนลง localStorage
  const saveScoreToBoard = (categoryName, score, total) => {
    const newData = { ...scoreboardData };
    if (!newData[categoryName] || score > newData[categoryName].score) {
      newData[categoryName] = { score, total, username };
      localStorage.setItem("scoreboard", JSON.stringify(newData));
      setScoreboardData(newData);
    }
  };

  const createBlank = (word) => {
    if (word.length <= 1) return word;
    const indexToRemove = Math.floor(Math.random() * word.length);
    return word.slice(0, indexToRemove) + "_" + word.slice(indexToRemove + 1);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setLearningIndex(0);
    setIsLearningDone(false);
    setCurrentWordIndex(0);
    setScore(0);
    setUserAnswer("");
    setFeedback(null);
    setShowResult(false);
    setBlankedWord(createBlank(category.words[0]));
    setShowScoreboard(false);
  };

  // เรียนคำศัพท์: กดถัดไป
  const handleNextLearning = () => {
    if (learningIndex < selectedCategory.words.length - 1) {
      setLearningIndex(learningIndex + 1);
    } else {
      setIsLearningDone(true);
    }
  };

  // กดย้อนกลับในหน้าเรียนคำศัพท์
  const handlePrevLearning = () => {
    if (learningIndex > 0) {
      setLearningIndex(learningIndex - 1);
    }
  };

  const startExercise = () => {
    setCurrentWordIndex(0);
    setScore(0);
    setUserAnswer("");
    setFeedback(null);
    setShowResult(false);
    setBlankedWord(createBlank(selectedCategory.words[0]));
  };

  const handleAnswerSubmit = () => {
    if (userAnswer.trim() === "") return;

    const correctWord = selectedCategory.words[currentWordIndex];
    const isCorrect = userAnswer.toLowerCase() === correctWord.toLowerCase();

    if (isCorrect) {
      setScore(score + 1);
      setFeedback("ถูกต้อง 🎉");
    } else {
      setFeedback(`ผิด! คำตอบที่ถูกคือ: ${correctWord}`);
    }
    setShowResult(true);

    setTimeout(() => {
      if (currentWordIndex < selectedCategory.words.length - 1) {
        const nextIndex = currentWordIndex + 1;
        setCurrentWordIndex(nextIndex);
        setBlankedWord(createBlank(selectedCategory.words[nextIndex]));
        setUserAnswer("");
        setFeedback(null);
        setShowResult(false);
      } else {
        alert(`จบแบบฝึก! คะแนนของคุณคือ ${isCorrect ? score + 1 : score} / ${selectedCategory.words.length}`);
        // บันทึกคะแนนลงบอร์ด
        saveScoreToBoard(selectedCategory.name, isCorrect ? score + 1 : score, selectedCategory.words.length);

        setSelectedCategory(null);
        setLearningIndex(0);
        setIsLearningDone(false);
        setCurrentWordIndex(0);
        setScore(0);
        setUserAnswer("");
        setFeedback(null);
        setShowResult(false);
      }
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  if (!username) return null;

  // หน้าแสดงบอร์ดคะแนน
  if (showScoreboard) {
    const entries = Object.entries(scoreboardData);
    return (
      <div className="app-container">
        <header>
          <h2>บอร์ดคะแนน</h2>
          <button className="logout-btn" onClick={handleLogout}>ออกจากระบบ</button>
        </header>
        <button onClick={() => setShowScoreboard(false)} className="back-btn">กลับ</button>

        {entries.length === 0 ? (
          <p>ยังไม่มีคะแนนบันทึกไว้</p>
        ) : (
          <table className="scoreboard-table">
            <thead>
              <tr>
                <th>หมวดหมู่</th>
                <th>ชื่อผู้เล่น</th>
                <th>คะแนน</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(([cat, data]) => (
                <tr key={cat}>
                  <td>{cat}</td>
                  <td>{data.username}</td>
                  <td>{data.score} / {data.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h2>สวัสดี, {username}!</h2>
        <button className="logout-btn" onClick={handleLogout}>ออกจากระบบ</button>
      </header>

      {!selectedCategory && (
        <>
          <h3>เลือกหมวดหมู่คำศัพท์</h3>
          <button className="show-scoreboard-btn" onClick={() => setShowScoreboard(true)}>
            ดูบอร์ดคะแนน
          </button>
          <div className="categories-list">
            {categoriesData.map(cat => (
              <button
                key={cat.name}
                onClick={() => handleSelectCategory(cat)}
                className="category-btn"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedCategory && !isLearningDone && (
        <>
          <h3>เรียนคำศัพท์หมวด: {selectedCategory.name}</h3>
          <p>คำที่ {learningIndex + 1} / {selectedCategory.words.length}</p>
          <div className="flashcard">
            {selectedCategory.words[learningIndex]}
          </div>

          <div className="learning-buttons">
            <button onClick={handlePrevLearning} disabled={learningIndex === 0} className="prev-btn">ย้อนกลับ</button>
            <button onClick={handleNextLearning} className="next-btn">
              {learningIndex < selectedCategory.words.length - 1 ? "คำถัดไป" : "เรียนจบ"}
            </button>
          </div>

          <button onClick={() => setSelectedCategory(null)} className="back-btn" style={{marginTop:"10px"}}>
            กลับไปเลือกหมวด
          </button>
        </>
      )}

      {selectedCategory && isLearningDone && (
        <>
          <h3>แบบฝึกเติมคำหมวด: {selectedCategory.name}</h3>
          <p>คำที่ {currentWordIndex + 1} / {selectedCategory.words.length}</p>
          <div className="flashcard">
            <span className="question">{blankedWord}</span>
          </div>

          <input
            type="text"
            placeholder="เติมคำที่ขาด"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAnswerSubmit();
              }
            }}
            disabled={showResult}
            className="answer-input"
          />

          <button
            onClick={handleAnswerSubmit}
            disabled={showResult}
            className="submit-btn"
          >
            ตอบคำถาม
          </button>

          {feedback && (
            <p className={`feedback ${feedback.startsWith("ถูก") ? "correct" : "wrong"}`}>
              {feedback}
            </p>
          )}

          <p className="score">คะแนน: {score} / {selectedCategory.words.length}</p>

          <button
            onClick={startExercise}
            className="start-exercise-btn"
            style={{ marginTop: "10px", backgroundColor: "#4caf50" }}
          >
            เริ่มแบบฝึกใหม่
          </button>

          <button
            onClick={() => {
              setSelectedCategory(null);
              setIsLearningDone(false);
              setLearningIndex(0);
            }}
            className="back-btn"
            style={{ marginTop: "10px" }}
          >
            กลับไปเลือกหมวด
          </button>
        </>
      )}
    </div>
  );
}
