create table downloads (
	feed_id int not null,
	transmission_id int not null,
	foreign key (feed_id) references rawfeed(id)
);
