import bcrypt from "@node-rs/bcrypt";
import {sqlite} from "$lib/db/schema";

export const runSeed = async () => {
//Jelszavak a tesztfelhasználókhoz
    const pass1 = 'password';
    const pass2 = 'secure';

    const hash1 = await bcrypt.hash(pass1, 12);
    const hash2 = await bcrypt.hash(pass2, 12);

    const userCreate = sqlite.prepare(
        `INSERT INTO user (id, name, email, password, image)
         VALUES (@id, @name, @email, @password, @image)`
    )
    userCreate.run({
        id: "user-1",
        name: "alice",
        email: "user1@gmail.com",
        password: hash1,
        image: "https://i.pravatar.cc/150?u=bob"
    });
    userCreate.run({
        id: "user-2",
        name: "bob",
        email: "user2@gmail.com",
        password: hash2,
        image: "https://i.pravatar.cc/150?u=alice"
    });

    sqlite.exec(`

        INSERT INTO book_rating (user_id, book_id, rating, comment)
        VALUES ('user-1', 'zyTCAlFPjgYC', 5, 'A classic!'),
               ('user-2', 'yDtCuFHXbAYC', 4, 'Very thought-provoking');

        INSERT INTO favourite (user_id, book_id, title, thumbnail)
        VALUES ('user-1', 'zyTCAlFPjgYC', 'The Great Gatsby', 'https://covers.openlibrary.org/b/id/8221251-L.jpg'),
               ('user-2', 'yDtCuFHXbAYC', '1984', 'https://covers.openlibrary.org/b/id/7222246-L.jpg'),
               ('user-2', 'PGR2AwAAQBAJ', 'To Kill a Mockingbird', 'https://covers.openlibrary.org/b/id/8225260-L.jpg');

        INSERT INTO currently_reading (user_id, book_id, title, thumbnail)
        VALUES ('user-1', 'PGR2AwAAQBAJ', 'To Kill a Mockingbird', 'https://covers.openlibrary.org/b/id/8225260-L.jpg');

        INSERT INTO already_read (user_id, book_id, title, thumbnail)
        VALUES ('user-1', 'zyTCAlFPjgYC', 'The Great Gatsby', 'https://covers.openlibrary.org/b/id/8221251-L.jpg'),
               ('user-2', 'yDtCuFHXbAYC', '1984', 'https://covers.openlibrary.org/b/id/7222246-L.jpg');
    `);
}