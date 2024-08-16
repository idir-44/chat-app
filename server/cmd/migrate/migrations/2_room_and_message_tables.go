package migrations

import (
	"context"
	"fmt"

	"github.com/uptrace/bun"
)

func init() {

	up := []string{`
		CREATE TABLE IF NOT EXISTS rooms (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		name VARCHAR(255) NOT NULL UNIQUE,

		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW()
	);
	`,
		`
		CREATE TABLE IF NOT EXISTS messages (
		id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
		content TEXT NOT NULL,
		email		VARCHAR(255) NOT NULL,
		room_id UUID,		

		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

		CONSTRAINT fk_messages_room_id	FOREIGN KEY(room_id) REFERENCES rooms(id) 
		);`}

	down := []string{`
			DROP TABLE IF EXISTS rooms CASCADE;
			DROP TABLE IF EXISTS messages CASCADE;
	`}

	Migrations.MustRegister(func(ctx context.Context, db *bun.DB) error {
		fmt.Print("creates rooms and messages tables")
		for _, q := range up {
			_, err := db.Exec(q)
			if err != nil {
				return err
			}
		}
		return nil
	}, func(ctx context.Context, db *bun.DB) error {
		fmt.Print("drops rooms and messages tables")
		for _, q := range down {
			_, err := db.Exec(q)
			if err != nil {
				return err
			}
		}
		return nil
	})
}
