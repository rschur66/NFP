DROP TABLE IF EXISTS  test_table;
DROP TABLE IF EXISTS  zip_tax;
DROP TABLE IF EXISTS  sqs_log;
DROP TABLE IF EXISTS  lead;
DROP TABLE IF EXISTS  credit_history;
DROP TABLE IF EXISTS  password_reset;
DROP TABLE IF EXISTS  magazine;
DROP TABLE IF EXISTS  discussion_like;
DROP TABLE IF EXISTS  discussion;
DROP TABLE IF EXISTS  member_product_reaction;
DROP TABLE IF EXISTS  reaction;
DROP TABLE IF EXISTS  box;
DROP TABLE IF EXISTS  subscription;
DROP TABLE IF EXISTS  subscription_renewal;
DROP TABLE IF EXISTS  gift;
DROP TABLE IF EXISTS  order_history_item;
DROP TABLE IF EXISTS  order_history;
DROP TABLE IF EXISTS  member;
DROP TABLE IF EXISTS  address;
DROP TABLE IF EXISTS  product_author;
DROP TABLE IF EXISTS  author;
DROP TABLE IF EXISTS  product_genre;
DROP TABLE IF EXISTS  genre;
DROP TABLE IF EXISTS  product;
DROP TABLE IF EXISTS  product_judge;
DROP TABLE IF EXISTS  judge;
DROP TABLE IF EXISTS  store_content;
DROP TABLE IF EXISTS  store_match;
DROP TABLE IF EXISTS  store_plan;
DROP TABLE IF EXISTS  plan;
DROP TABLE IF EXISTS  store;
DROP TABLE IF EXISTS  social;
DROP TABLE IF EXISTS  box_log;
DROP TABLE IF EXISTS  visit_log;
DROP TABLE IF EXISTS  member_log;
DROP TABLE IF EXISTS  activity_log;
DROP TABLE IF EXISTS  error_log;

CREATE TABLE social (
    id          int unsigned primary key auto_increment,
    website     varchar(255),
    facebook    varchar(63),
    twitter     varchar(63),
    tumblr      varchar(63),
    instagram   varchar(63)
);


CREATE TABLE store (
    id          int unsigned primary key auto_increment,
    tla         char(3) not null,
    name        varchar(63),
    plan1_id    int unsigned default null,
    plan2_id    int unsigned default null,
    plan3_id    int unsigned default null
);

CREATE TABLE plan (
    id              int unsigned primary key auto_increment,
    name            varchar(63) not null,
    price_label     text,
    price_blurb     text,
    description     text,
    mmid            int unsigned not null,
    months          tinyint unsigned not null,
    price           float(5,2),
    renews_into     int unsigned,
    store_id        int unsigned,
    start_date      date,
    end_date        date,
    promo           char(16) default null,
    foreign key (store_id) references store(id) on delete cascade
);

CREATE TABLE store_match (
    store_id    int unsigned,
    regex       varchar(63),
    position    int unsigned,
    primary key (position),
    foreign key (store_id) references store(id) on delete cascade
);

CREATE TABLE store_content (
    store_id      int unsigned,
    text_data     text,
    email_from    varchar(50),
    email_support varchar(50),
    email_abuse   varchar(50),
    email_privacy varchar(50),
    foreign key (store_id) references store(id) on delete cascade
);

CREATE TABLE store_plan (
    store_id    int unsigned,
    code        char(16) default null,
    description text default null,
    plan_id     int unsigned,
    start_date  datetime default null,
    end_date    datetime default null,
    active      bool default false,
    primary key (store_id, code)
);

CREATE TABLE judge (
    id          int unsigned primary key auto_increment,
    name        varchar(63),
    role        varchar(255),
    img         varchar(255),
    bio         text,
    guest       bool,
    social_id   int unsigned,
    store_id    int unsigned,
    foreign key (social_id) references social(id) on delete set null
);

CREATE TABLE product (
    id                  int unsigned primary key auto_increment,
    mmid                int unsigned not null,
    title               varchar(63),
    subtitle            varchar(63),
    pub_date            date not null,
    month               tinyint unsigned,
    year                tinyint unsigned,
    pages               smallint,
    description_title   varchar(255),
    description         text,
    in_stock            bool,
    img                 varchar(255),
    judge_blurb         text,
	featured            bool,
	position            tinyint,
    visible             bool,
    price               float(5,2),
    swag                bool default false,
    judge_id            int unsigned,
    store_id            int unsigned,
    social_id           int unsigned,
    foreign key (store_id) references store(id) on delete cascade,
    foreign key (judge_id) references judge(id) on delete set null
);

CREATE TABLE genre (
    id          int unsigned primary key auto_increment,
    label       varchar(63)
);

CREATE TABLE product_genre (
    product_id  int unsigned,
    genre_id    int unsigned,
    foreign key (product_id) references product(id) on delete cascade,
    foreign key (genre_id) references genre(id) on delete cascade,
    primary key (product_id, genre_id)
);

CREATE TABLE author (
    id          int unsigned primary key auto_increment,
    name        varchar(63),
    bio         text,
    img         varchar(255),
    social_id   int unsigned,
    store_id    int unsigned,
    foreign key (social_id) references social(id) on delete set null
);

CREATE TABLE product_author (
    product_id  int unsigned,
    author_id   int unsigned,
    position    int unsigned,
    primary key (product_id, position),
    foreign key (product_id) references product(id) on delete cascade,
    foreign key (author_id) references author(id) on delete cascade
);

CREATE TABLE address (
    id              int unsigned primary key auto_increment,
    name            varchar(63),
    street1         varchar(63),
    street2         varchar(63),
    city            varchar(63),
    state           enum('AL','AK','AZ','AR','CA','CO','CT','DE','DC',
                         'FL','GA','HI','ID','IL','IN','IA','KS','KY',
                         'LA','ME','MD','MA','MI','MN','MS','MO','MT',
                         'NE','NV','NH','NJ','NM','NY','NC','ND','OH',
                         'OK','OR','PA','RI','SC','SD','TN','TX','UT',
                         'VT','VA','WA','WV','WI','WY'),
    zip             char(10),
    usps_validated  bool default false
);

CREATE TABLE member (
    id              int unsigned primary key auto_increment,
    netsuite_id     int unsigned default null,
    store_id        int unsigned,
    first_name      varchar(63) not null,
    last_name       varchar(63) not null,
    display_name    varchar(63) not null,
    email           varchar(255) not null,
    phone           varchar(63),
    status          ENUM('Active','Inactive','Pending') NOT NULL default 'Pending',
    type            ENUM('Member', 'Admin', 'Judge', 'Leader', 'Author') NOT NULL default 'Member',
    enroll_date     datetime not null default current_timestamp,
    picture_url     varchar(63) not null default 'placeholder.jpg',
    source          varchar(255),
    social_id       int unsigned,
    address_id      int unsigned,
    password_hash   varchar(255) default null,
    refer_code      char(16),
    referred_by     int unsigned default null,
    test            bool,
    foreign key (social_id) references social(id) on delete set null,
    foreign key (store_id) references store(id) on delete cascade,
    foreign key (address_id) references address(id) on delete set null,
    foreign key (referred_by) references member(id) on delete set null,
    unique (store_id, email),
    unique (refer_code),
    key (refer_code),
	key (netsuite_id)
);

CREATE TABLE box (
    member_id       int unsigned not null,
    product_id      int unsigned not null,
    special         bool not null default false,
    swag            bool not null default false,
    month           tinyint unsigned not null,
    year            tinyint unsigned not null,
    price           float(5,2) not null default 0.00,
    tax_rate        float(5,5) not null default 0.00000,
    shipped         bool not null default false,
    date_shipped    date default null,
    tracking_number varchar(255),
    primary key (member_id, year, month, product_id, special),
    foreign key (member_id) references member(id) on delete cascade,
    foreign key (product_id) references product(id) on delete cascade
);

CREATE TABLE subscription (
    store_id        int unsigned not null,
    member_id       int unsigned not null,
    plan_id         int unsigned not null,
    first_month     tinyint unsigned not null,
    first_year      tinyint unsigned not null,
    last_month      tinyint unsigned not null,
    last_year       tinyint unsigned not null,
    months_skipped  tinyint unsigned not null default 0,
    price           float(5,2),
    tax_rate        float(5,5),
    will_renew      bool default true,
    gift            bool default false,
    renewal_plan_id int unsigned default null,
    primary key (store_id, member_id, plan_id, last_month, last_year),
    foreign key (store_id) references store(id) on delete cascade,
    foreign key (member_id) references member(id) on delete cascade,
    foreign key (plan_id) references plan(id),
    foreign key (renewal_plan_id) references plan(id) on delete set null
);

CREATE TABLE subscription_renewal (
    member_id INT(10) UNSIGNED NOT NULL,
    first_name VARCHAR(63) NOT NULL,
    email VARCHAR(255) NOT NULL,
    store_id INT UNSIGNED NOT NULL,
    month TINYINT UNSIGNED NOT NULL,
    year TINYINT UNSIGNED NOT NULL,
    is_resolved TINYINT(1) DEFAULT 0,
    subscription_added TINYINT(1) DEFAULT 0,
    sent_to_sqs TINYINT(1) DEFAULT 0,
    sent_email TINYINT(1) DEFAULT 0,
    has_failed TINYINT UNSIGNED DEFAULT 0,
    braintree_transaction TEXT DEFAULT NULL,
    error_message TEXT DEFAULT NULL,
    last_four INT(5) UNSIGNED NOT NULL,
    plan_name VARCHAR(63) NOT NULL,
    plan_id INT UNSIGNED DEFAULT NULL,
    plan_months TINYINT(3) unsigned DEFAULT NULL,
    plan_price FLOAT(5,2) DEFAULT NULL,
    plan_renew_into INT UNSIGNED DEFAULT NULL,
    tax_rate FLOAT(5,5) DEFAULT NULL,
    order_history_id INT UNSIGNED DEFAULT NULL,
    plan_mmid INT UNSIGNED DEFAULT NULL,
    name VARCHAR(63) DEFAULT NULL,
    street1 VARCHAR(63) DEFAULT NULL,
    street2 VARCHAR(63) DEFAULT NULL,
    city   VARCHAR(63) DEFAULT NULL,
    state ENUM('AL','AK','AZ','AR','CA','CO','CT','DE','DC',
       'FL','GA','HI','ID','IL','IN','IA','KS','KY',
       'LA','ME','MD','MA','MI','MN','MS','MO','MT',
       'NE','NV','NH','NJ','NM','NY','NC','ND','OH',
       'OK','OR','PA','RI','SC','SD','TN','TX','UT',
       'VT','VA','WA','WV','WI','WY'),
    zip CHAR(10) DEFAULT NULL,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE order_placement (
    member_id       INT UNSIGNED,
    store_id        INT UNSIGNED,
    month           TINYINT UNSIGNED,
    year            TINYINT UNSIGNED,
    products		VARCHAR(255),
    product_ids     VARCHAR(255),
    product_mmids   VARCHAR(255),
    product_prices  VARCHAR(255),
    product_credits	VARCHAR(255),
    subtotal		FLOAT(5,2),
    tax_rate        FLOAT(5,5),
    total			FLOAT(5,2),
    credits         TINYINT DEFAULT 0,
    is_charged		BOOLEAN DEFAULT FALSE,
    charge_attempts TINYINT DEFAULT 0,
    last_four		CHAR(4) DEFAULT NULL,
    card_type		VARCHAR(255) DEFAULT NULL,
    transaction_id	VARCHAR(255) DEFAULT NULL,
    transaction		TEXT DEFAULT NULL,
    is_sent         BOOLEAN DEFAULT FALSE,
    order_id        INT UNSIGNED,
    is_confirmed    BOOLEAN DEFAULT FALSE,
    address_name    VARCHAR(255),
    address_street1 VARCHAR(255),
    address_street2 VARCHAR(255),
    address_city    VARCHAR(255),
    address_state   VARCHAR(255),
    address_zip     VARCHAR(255),
    tracking_number VARCHAR(255),
    PRIMARY KEY (member_id, year, month)
);

CREATE TABLE reaction (
    id          int unsigned primary key auto_increment,
    label       varchar(63)
);

CREATE TABLE member_product_reaction (
    member_id   int unsigned,
    product_id  int unsigned,
    reaction_id int unsigned,
    primary key (member_id, product_id, reaction_id),
    foreign key (member_id) references member(id) on delete cascade,
    foreign key (product_id) references product(id) on delete cascade,
    foreign key (reaction_id) references reaction(id) on delete cascade
);

CREATE TABLE discussion (
    id            int unsigned primary key AUTO_INCREMENT,
    thread_id     int unsigned NOT NULL,
    product_id    int unsigned,
    member_id     int unsigned,
    sequence      int unsigned NOT NULL,
    indent        int unsigned NOT NULL,
    date_posted   datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title         varchar(255) DEFAULT NULL,
    body          text,
    visible       bool not null default true,
    UNIQUE KEY unique_position (thread_id, sequence),
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE SET NULL,
	FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE SET NULL
);

CREATE TABLE discussion_like (
    member_id       int unsigned,
    discussion_id      int unsigned,
    PRIMARY KEY (member_id, discussion_id),
    FOREIGN KEY (discussion_id) REFERENCES discussion(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE
);

CREATE TABLE magazine (
	id				int unsigned primary key auto_increment,
    title       	varchar(127) not null default '',
    subtitle    	varchar(255) not null default '',
    presummary      text,
    summary     	text,
    cover_img		varchar(63) not null default 'defaultCover.jpg',
	post_img		varchar(63) not null default 'defaultPost.jpg',
	author			varchar(63),
	youtube_link	char(11) default null,
	live_date		datetime not null default current_timestamp,
	visible			boolean,
	store_id        int unsigned
);

CREATE TABLE order_history (
    id              int unsigned primary key auto_increment,
    label           varchar(63),
    member_id       int unsigned not null,
    date_created    timestamp,
    status          enum('Shipped','Auth','Skipped','Free','Settled','Rejected','Charged'),
    foreign key (member_id) references member(id) on delete cascade
);

CREATE TABLE order_history_item (
    id                  int unsigned primary key auto_increment,
    order_history_id    int unsigned,
    product_id          int unsigned,
    type                enum('Subscription','Book','Subscription Modification'),
    price               decimal(5,2),
    tax_rate            decimal(5,3),
    foreign key (order_history_id) references order_history(id) on delete cascade
);

CREATE TABLE zip_tax (
    zip5    char(5) primary key,
    rate    float(5,5)
);

CREATE TABLE password_reset (
    member_id       int unsigned,
    token           char(16),
    when_created    timestamp not null default current_timestamp,
    unique key (member_id),
    key (token),
    foreign key (member_id) references member(id)
);

CREATE TABLE credit_history (
    id              int unsigned primary key auto_increment,
    member_id       int unsigned,
    delta           tinyint,
    source          varchar(63),
    date_time       datetime not null default current_timestamp,
    foreign key (member_id) references member(id) on delete cascade
);

CREATE TABLE lead (
    id              int unsigned primary key auto_increment,
    store_id        int unsigned,
    email           varchar(255),
    source          varchar(255),
    first_seen      datetime not null default current_timestamp,
    unique key (email)
);

CREATE TABLE gift (
    id                  int unsigned primary key auto_increment,
    gift_code           varchar(50),
    voucher_code        varchar(255),
    message             text,
    plan_id             int unsigned,
    giver_name          varchar(255),
    giver_email         varchar(255),
    recipient_name      varchar(255),
    recipient_email     varchar(255),
    delivery_method     enum('email','voucher') not null,
    bt_transaction_id   varchar(20),
    bt_transaction_amt  float(5,2),
    purchase_date       datetime default current_timestamp,
    delivery_date       datetime default current_timestamp,
    delivered           bool default false,
    redeemed            bool default false,
    redeemed_by         int unsigned default null,
    unique key (gift_code),
    foreign key (plan_id) references plan(id)
);

CREATE TABLE groupon (
    id                  int unsigned primary key auto_increment,
    groupon_code        varchar(50),
    plan_id             int unsigned,
    redeemed            bool default false,
    redeemed_by         int unsigned default null,
    unique key (groupon_code),
    foreign key (plan_id) references plan(id)
);


CREATE TABLE selection_suggestions (
    id              int unsigned primary key auto_increment,
    store_id        int unsigned,
    member_id       varchar(100),
    title           varchar(100),
    first_seen      timestamp not null default current_timestamp
);

CREATE TABLE test_table (
    id              int unsigned primary key auto_increment,
    val             int unsigned
);

CREATE TABLE sqs_log (
    id              int unsigned primary key auto_increment,
    queue           ENUM('ENROLL','INVOICE','GIFTPURCHASE','GIFTREDEEM','GIFTENROLL'),
    object          text,
    response        text,
    sent            bool default false,
    time_submitted  datetime not null default current_timestamp
);

CREATE TABLE box_log (
    id              int unsigned primary key auto_increment,
    member_id       int unsigned,
    month           tinyint,
    year            tinyint,
    datetime        timestamp not null default current_timestamp,
    action          enum('remove','add','makeBoM','skip') not null,
    product_id      int unsigned
);

CREATE TABLE visit_log (
    id              int unsigned primary key auto_increment,
    member_id       int unsigned,
    ip				int unsigned,
    path            varchar(255),
    referrer        varchar(255),
    query           text,
    datetime        timestamp not null default current_timestamp
);

CREATE TABLE member_log (
    id              int unsigned primary key auto_increment,
    member_id       int unsigned,
    action          enum('update', 'create', 'logout', 'passwordReset', 'changeRenew', 'applyGift', 'purchasePlan'),
    params          text,
    datetime        timestamp not null default current_timestamp
);

CREATE TABLE activity_log (
  id				bigint unsigned primary key auto_increment,
  ip                bigint unsigned DEFAULT 0,
  member_id         int unsigned DEFAULT 0,
  path              varchar(255) default null,
  serve_time        int unsigned,
  time              datetime not null default current_timestamp
);

CREATE TABLE error_log (
  id				bigint unsigned primary key auto_increment,
  ip                bigint unsigned DEFAULT 0,
  member_id         int unsigned DEFAULT 0,
  path              varchar(255) default null,
  action            varchar(255),
  error             varchar(255),
  userAgent         varchar(255),
  time              datetime not null default current_timestamp
) ENGINE=ARCHIVE;

-- CREATE USER 'client_read'@'%' IDENTIFIED BY 'mF2UQ8vxxMKY5cWA';
-- GRANT SELECT, LOCK TABLES ON Xavier.* TO 'client_read'@'%';
-- CREATE USER 'client_write'@'%' IDENTIFIED BY 'WubLFtEGwD5whamZ';
-- GRANT SELECT, INSERT, UPDATE ON Xavier.* TO 'client_write'@'%';
-- GRANT DELETE ON Xavier.discussion_like TO 'client_write'@'%';
-- GRANT DELETE ON Xavier.box TO 'client_write'@'%';
-- GRANT DELETE ON Xavier.test_table to 'client_write'@'%';
