create table Roles(
	id int identity(0, 1) not null primary key,
	name char(10)
);

create table Users(
	id int not null identity(0, 1) primary key,
	firstName nvarchar(20),
	lastName nvarchar(20),
	username varchar(20),
	password varchar(20),
	phoneNum varchar(10),
	email varchar(40),
	bio nvarchar(1500),
	postPublishedCount int,
	gender bit,
	friendCount int,
	profilePicturePath varchar(500),
	roleId int foreign key references Roles(id)
);

create table Access(
	id int not null identity(0, 1) primary key,
	name char(10)
);

create table Post(
	id int not null identity(0, 1) primary key,
	title nvarchar(50),
	content ntext,
	likedCount int,
	sharedCount int,
	publishedDate datetime,
	commentCount int,
	savedCount int,
	imagePath varchar(500),
	accessId int foreign key references Access(id)
);

create table Tags(
	id int not null identity(0, 1) primary key,
	name varchar(30)
);

create table Actions(
	id int not null identity(0, 1) primary key,
	name char(10)
);

create table Images(
	id int not null identity(0, 1) primary key,
	imgPath varchar(500),
	uploadedDate datetime,
	fileType char(5),
	size float
);

create table Category(
	id int not null identity(0, 1) primary key,
	name nvarchar(20),
	descriptions nvarchar(500)
);

create table PostCategory(
	id int not null identity(0, 1) primary key,
	categoryId int foreign key references Category(id),
	postId int foreign key references Post(id)
);

create table Comment(
	id int not null identity(0, 1) primary key,
	content ntext,
	userId int foreign key references Users(id),
	postId int foreign key references Post(id),
	publishedDate datetime
);

create table PostLike(
	id int not null identity(0, 1) primary key,
	postId int foreign key references Post(id),
	userId int foreign key references Users(id),
	likedDate datetime
);

create table PostShare(
	id int not null identity(0, 1) primary key,
	postId int foreign key references Post(id),
	userId int foreign key references Users(id),
	sharedDate datetime
);

create table PostSave(
	id int not null identity(0, 1) primary key,
	postId int foreign key references Post(id),
	userId int foreign key references Users(id),
	savedDate datetime
);

create table Friend(
	friendId int not null primary key,
	currentUserId int foreign key references Users(id),
	addedDate datetime,
	isAccept bit
);

create table notifications(
	id int not null identity(0, 1) primary key,
	postId int foreign key references Post(id),
	actionId int foreign key references Actions(id),
	userId int foreign key references Users(id),
	activedDate datetime,
	isSeen bit
);

create table PostImage(
	id int not null identity(0, 1) primary key,
	postId int foreign key references Post(id),
	imageId int foreign key references Images(id)
);

create table PostTag(
	id int not null identity(0, 1) primary key,
	postId int foreign key references Post(id),
	tagId int foreign key references Tags(id)
);