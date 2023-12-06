DELETE FROM user;
DELETE FROM post;
DELETE FROM report;
DELETE FROM response;
DELETE FROM view;
DELETE FROM comment_rate;
DELETE FROM comment;
DELETE FROM post_category;
DELETE FROM category;

-- Insertion dans la table "user"
INSERT INTO "user" (id, nickname, age, gender, firstname, lastname, email, password, avatarURL, role)
VALUES
('1', 'john_doe', '25', 'Male', 'John', 'Doe', 'john.doe@email.com', 'hashed_password', 'avatar_url', '0'),
('2', 'jane_smith', '30', 'Female', 'Jane', 'Smith', 'jane.smith@email.com', 'hashed_password', 'avatar_url', '0');

-- Insertion dans la table "post"
INSERT INTO "post" (id, title, slug, description, imageURL, authorID, isEdited, createDate, modifiedDate, validate)
VALUES
('1', 'Sample Post 1', 'sample-post-1', 'Description for post 1', 'image_url_1', '1', false, '2023-01-01', '2023-01-01', true),
('2', 'Sample Post 2', 'sample-post-2', 'Description for post 2', 'image_url_2', '2', false, '2023-01-02', '2023-01-02', true);

-- Insertion dans la table "report"
INSERT INTO "report" (id, authorID, reportedID, reportedName, cause, type, createDate, modifiedDate, reported, imageURL)
VALUES
('1', '1', '2', 'jane_smith', 'Offensive content', 'user', '2023-01-03', '2023-01-03', false, 'image_url_report_1'),
('2', '2', '1', 'john_doe', 'Spam', 'user', '2023-01-04', '2023-01-04', false, 'image_url_report_2');

-- Insertion dans la table "response"
INSERT INTO "response" (id, authorID, reportID, content, createDate, modifiedDate)
VALUES
('1', '1', '1', 'Response to report 1', '2023-01-05', '2023-01-05'),
('2', '2', '2', 'Response to report 2', '2023-01-06', '2023-01-06');

-- Insertion dans la table "view"
INSERT INTO "view" (id, isBookmarked, rate, authorID, postID)
VALUES
('1', true, 4, '1', '1'),
('2', false, 5, '2', '2');

-- Insertion dans la table "comment_rate"
INSERT INTO "comment_rate" (id, authorID, commentID, rate)
VALUES
('1', '1', '1', 3),
('2', '2', '2', 4);

-- Insertion dans la table "comment"
INSERT INTO "comment" (id, text, authorID, postID, parentID, createDate, modifiedDate)
VALUES
('1', 'Comment on post 1', '1', '1', NULL, '2023-01-07', '2023-01-07'),
('2', 'Comment on post 2', '2', '2', NULL, '2023-01-08', '2023-01-08');

-- Insertion dans la table "post_category"
INSERT INTO "post_category" (id, categoryID, postID)
VALUES
('1', '1', '1'),
('2', '2', '2');

-- Insertion dans la table "category"
INSERT INTO "category" (id, name, createDate, modifiedDate)
VALUES
('1', 'Technology', '2023-01-09', '2023-01-09'),
('2', 'Travel', '2023-01-10', '2023-01-10');

-- Insertion dans la table "notification"
INSERT INTO "notification" (id, authorID, author_name, postID, ownerID, notif_type, slug, time, Readed)
VALUES
('1', '1', 'john_doe', '1', '2', 'comment', 'post-1-comment', '2023-01-11', false),
('2', '2', 'jane_smith', '2', '1', 'rate', 'post-2-rate', '2023-01-12', false);

-- Insertion dans la table "request"
INSERT INTO "request" (id, authorID, time, username, imageurl, role)
VALUES
('1', '1', '2023-01-13', 'user1', 'image_url_user1', 'admin'),
('2', '2', '2023-01-14', 'user2', 'image_url_user2', 'moderator');
