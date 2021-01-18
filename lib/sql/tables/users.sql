create table warzone.users
(
	user_id serial not null
		constraint users_pkey
			primary key,
	email varchar(260)
		constraint users_email_key
			unique,
	password text,
	first_name varchar(50),
	metadata json,
	confirm_string text,
	forgot_string text
);

alter table warzone.users owner to fjcexshgdfbtia;

