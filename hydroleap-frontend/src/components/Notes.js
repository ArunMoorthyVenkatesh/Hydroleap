import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { createNote, fetchNotes } from "../api";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const loadNotes = useCallback(async () => {
    try {
      const res = await fetchNotes(token);
      setNotes(res.data);
    } catch (err) {
      console.error("Fetch notes failed:", err.response?.data || err.message);
    }
  }, [token]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleCreateNote = async () => {
    if (!title || !content) return alert("Both fields are required");
    try {
      await createNote({ title, content }, token);
      setTitle("");
      setContent("");
      loadNotes();
    } catch (err) {
      console.error("Create note failed:", err.response?.data || err.message);
      alert("Failed to create note");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <Header clickable />
      <h1 style={styles.heading}>Notes</h1>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          style={{ ...styles.input, height: "120px", resize: "none" }}
        />
        <button onClick={handleCreateNote} style={styles.button}>
          Create Note
        </button>
        <button onClick={handleSignOut} style={styles.signOut}>
          Sign Out
        </button>
      </div>

      <div style={styles.notesList}>
        {notes.map((note) => (
          <div key={note._id} style={styles.noteCard}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "Times New Roman, serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "80px",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "500px",  
    gap: "1rem",
  },
  input: {
    padding: "0.75rem",
    border: "none",
    fontSize: "1rem",
    fontFamily: "Times New Roman, serif",
  },
  button: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#888",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  signOut: {
    padding: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #fff",
    backgroundColor: "transparent",
    color: "#fff",
    cursor: "pointer",
    marginTop: "1rem",
  },
  note: {
    backgroundColor: "#111",
    padding: "1rem",
    borderRadius: "4px",
    border: "1px solid #444",
    marginTop: "1rem",
    width: "1000px",  
  },
  noteTitle: {
    fontWeight: "bold",
    fontSize: "1.1rem",
    marginBottom: "0.5rem",
  },
  noteContent: {
    fontSize: "1rem",
  },
  
};


export default Notes;
