create table parsedfeed (
	rawfeed_id int not null references rawfeed(id),
	title varchar(255),
	series int,
	episode int,
	parseddate varchar(32),
	flags varchar(72)
);

