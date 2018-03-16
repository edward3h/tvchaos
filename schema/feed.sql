create table rawfeed (
	linkurl varchar(255) not null primary key,
	title varchar(255) not null,
	description text,
	created_at datetime default current_timestamp
);
