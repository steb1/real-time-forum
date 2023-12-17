package models

import (
	"database/sql"
	"fmt"

	"github.com/gofrs/uuid"
)

type Message struct {
	ID       uuid.UUID
	Message  string
	Author   string
	Receiver string
	Time     string
}

type MessageRepository struct {
	db *sql.DB
}

func NewMessageRepository(db *sql.DB) *MessageRepository {
	return &MessageRepository{
		db: db,
	}
}

// CreateMessage crée un nouveau message dans la base de données.
func (r *MessageRepository) CreateMessage(msg Message) (uuid.UUID, error) {
	ID, err := uuid.NewV4()
	if err != nil {
		return uuid.UUID{}, err
	}

	stmt, err := r.db.Prepare("INSERT INTO message (id, message, author, receiver, time) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		return uuid.UUID{}, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(ID.String(), msg.Message, msg.Author, msg.Receiver, msg.Time)
	if err != nil {
		return uuid.UUID{}, err
	}

	return msg.ID, nil
}

// GetMessage récupère un message par ID depuis la base de données.
func (r *MessageRepository) GetMessage(id uuid.UUID) (*Message, error) {
	row := r.db.QueryRow("SELECT id, message, author, receiver, time FROM messages WHERE id = ?", id.String())

	var msg Message
	err := row.Scan(&msg.ID, &msg.Message, &msg.Author, &msg.Receiver, &msg.Time)
	if err != nil {
		return nil, err
	}

	return &msg, nil
}

// UpdateMessage met à jour un message existant dans la base de données.
func (r *MessageRepository) UpdateMessage(id uuid.UUID, updatedMsg Message) error {
	stmt, err := r.db.Prepare("UPDATE messages SET message=?, author=?, receiver=?, time=? WHERE id=?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(updatedMsg.Message, updatedMsg.Author, updatedMsg.Receiver, updatedMsg.Time, id.String())
	if err != nil {
		return err
	}

	return nil
}

// DeleteMessage supprime un message par ID de la base de données.
func (r *MessageRepository) DeleteMessage(id uuid.UUID) error {
	stmt, err := r.db.Prepare("DELETE FROM messages WHERE id=?")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(id.String())
	if err != nil {
		return err
	}

	return nil
}

func (mr *MessageRepository) GetMessagesBySenderAndReceiver(sender string, receiver string) ([]Message, error) {

	rows, err := mr.db.Query("SELECT id, message, author, receiver, time FROM message WHERE (author = ? AND receiver = ?) OR (author = ? AND receiver = ?)", sender, receiver, receiver, sender)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []Message
	for rows.Next() {
		var message Message
		err := rows.Scan(&message.ID, &message.Message, &message.Author, &message.Receiver, &message.Time)
		if err != nil {
			return nil, err
		}
		messages = append(messages, message)
	}

	return messages, nil
}

func (mr *MessageRepository) GetMessagesByUser(username string) ([]Message, error) {

	rows, err := mr.db.Query("SELECT id, message, author, receiver, time FROM message WHERE author = ?", username)
	if err != nil {
		fmt.Println("error here")
		return nil, err
	}
	defer rows.Close()

	var messages []Message

	for rows.Next() {
		var message Message
		err := rows.Scan(&message.ID, &message.Message, &message.Author, &message.Receiver, &message.Time)
		if err != nil {
			return nil, err
		}
		messages = append(messages, message)
	}

	return messages, nil
}
