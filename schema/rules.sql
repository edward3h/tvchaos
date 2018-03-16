create table rules (
	name varchar(32) not null primary key,
	pattern varchar(255) not null,
	pattern_type varchar(12) not null default 'regexp',
	action varchar(12) not null,
	created_at datetime default current_timestamp,
	updated_at datetime default current_timestamp on update current_timestamp
);
