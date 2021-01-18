create table warzone.gamer_relationships
(
	user_id serial not null
		constraint gamer_relationships_user_id_fkey
			references warzone.users,
	username varchar(130) not null,
	platform varchar(20) not null,
	type varchar(50) not null,
	is_favorite boolean,
	metadata json,
	constraint gamer_relationships_pkey
		primary key (user_id, username, platform),
	constraint gamer_relationships_username_fkey
		foreign key (username, platform) references warzone.gamers
);

