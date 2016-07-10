const pageData = new Map();
const redirects = new Map();

pageData.set('/', {
  keywords: 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started',
  description: 'Book of the Month is the best way to discover and read the best new books each month.',
  title: 'Book of the Month'
});
pageData.set('/learn-more', {
  keywords: 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started, how it works, free shipping',
  description: 'Awesome Books, Better Reading. Every Month. Choose from our judges 5 new selections each month.  Add up to 2 more books for only $9.99 and every box ships for free.',
  title: 'Learn More | Book of the Month'
});
pageData.set('/selections', {
  keywords: 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started, judges, editorial, book reviews, book recommendations',
  description: 'A Book is a Dream You Hold In Your Hand" - Neil Gaiman. Book of the Month selections are are your ticket to a great each month.  We select well-written, immersive stories, that transport you, give you thrills, and tug at your heartstrings.  Books that are truly worth reading.',
  title: 'Selections | Book of the Month'
});
pageData.set('/our-story', {
  keywords: 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started, judges, editorial, book reviews, book recommendations',
  description: 'Founded in 1926, Book of the Month has been serving ready for 90 years. In 2016, our legacy was reborn, when we relaunched as a subscription box service for avid readers. Join us and participate in 90 years of literary heritage.',
  title: 'Our Story | Book of the Month'
});
pageData.set('/magazine', {
  keywords: 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started, book blog, interview',
  description: 'Book of the Month Selections & Beyond: Interviews, excerpts, images, and more.',
  title: 'BOTM Magazine',
  type: 'article'
});
pageData.set('/discussions', {
  keywords: 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started, discussions, social, forum, discussion forum, chat, book club',
  description: 'Discuss the Book of the Month selections with your fellow members.  New to book of the month? Join today and jump into the discussions.',
  title: 'Discussions | Book of the Month'
});
pageData.set('/gift', {
  keywords: 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started, gift, give a gift, receive a gift, book gifts, gifts for readers, book gifts, claim a gift, gift ideas',
  description: 'Book of the Month makes a perfect gift. Give the reader in your life a 3, 6, or 12-month gift subscription.',
  title: 'Give the Gift of Reading | Book of the Month'
});
pageData.set('/gift/redeem', {
  keywords: 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started, gift, give a gift, receive a gift, book gifts, gifts for readers, book gifts, claim a gift, gift ideas',
  description: 'Did you receive a Book of the Month gift subscription?  Congratulations!  Redeem your give today and enjoy your membership.  Happy reading.',
  title: 'Redeem a Gift | Book of the Month'
});
pageData.set('/login', {
  keywords: 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started',
  description: 'Login to your Book of the Month account.  New to Book of the Month?  Join today!',
  title: 'Login | Book of the Month'
});
pageData.set('/enroll', {
  keywords: 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started',
  description: 'Book of the Month is the best way to discover and read the best new books each month. Join today!',
  title: 'Join Today | Book of the Month'
});
pageData.set('/judges', {
  keywords: 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started, judges, editorial, book reviews, book recommendations',
  description: 'Our Judges are passionate readers who love discovering great books and sharing them with our members. Learn more about the Judges and browse their past selections.',
  title: 'Meet Our Judges | Book of the Month',
  type: 'article'
});

redirects.set('/index.html', '/');
redirects.set('/faq.html', 'learn-more');
redirects.set('/selections.html', 'about-selections'); 
redirects.set('/magazine.html', 'magazine');
redirects.set('/discussions.html', 'discussions');
redirects.set('/gift-purchase.html', 'gift');
redirects.set('/redeem.html', 'gift/redeem');
redirects.set('/login.html', 'login');
redirects.set('/join-landing.html', 'enroll');
redirects.set('/judges.html', 'judges');

export function getKeywords(path) {
  let pathS = path.split("/"), defaultText = 'book of the month, best books of the month, book club, book of the month club, BOTM, BOTM Magazine, Book of the Month Magazine, books, novels, reading, best books, fiction, literary fiction, join, get started';
  if(!(pathS[1] === "gift" && pathS[2] === "redeem"))
    return typeof pageData.get("/"+pathS[1]) === 'object' ? (pageData.get("/"+pathS[1]))['keywords'] : defaultText;
  else if(pathS[1] === "gift" && pathS[2] === "redeem")
    return typeof pageData.get(path) === 'object' ? (pageData.get(path))['keywords'] : defaultText;
  return defaultText;
}

export function getType(path){
  let pathS = path.split("/"), defaultText = 'website';
  if(!(pathS[1] === "gift" && pathS[2] === "redeem"))
    return typeof pageData.get("/"+pathS[1]) === 'object' ? (pageData.get("/"+pathS[1]))['keywords'] : defaultText;
  else if(pathS[1] === "gift" && pathS[2] === "redeem")
    return typeof pageData.get(path) === 'object' ? (pageData.get(path))['type'] : defaultText;
  return defaultText;
}

function judgeExists(id=null, judges){
  if(id){
    let judge_id = parseInt(id.substr(id.lastIndexOf('-') + 1));
    if( !isNaN(judge_id) && typeof judge_id === "number" && judges[judge_id] )
      return judges[judge_id];
  }
  return false;
}

function magazinePostExists(id=null, magazine){
  let magazine_id = parseInt(id);
  if( !isNaN(magazine_id) && typeof magazine_id === "number"){
    let mag = magazine.find(x => x.id === magazine_id);
    if( mag ) return mag;
  }
  return false;
}

export function getImage(path, store){
  let pathS = path.split("/"), defaultText = '',
    isJudge = judgeExists(pathS[2] || null, store.judges ),
    isMagazinePost = magazinePostExists(pathS[3] || null , store.magazine);
  if(pathS[1] === 'judges' && isJudge )
    return "//s3.amazonaws.com/botm-media/judges/" + isJudge.img;
  else if( pathS[1] === 'magazine' && pathS[2] === 'post' && isMagazinePost )
    return "//s3.amazonaws.com/botm-media/magazine/images/" + isMagazinePost.post_img;
  return defaultText;
}

export function getDescription(path, store) {
  let pathS = path.split("/"), defaultText = 'Book of the Month is the best way to discover and read the best new books each month. Join today!';
  let isJudge = judgeExists(pathS[2] || null, store.judges ),
      isMagazinePost = magazinePostExists(pathS[3] || null , store.magazine);
  if(pathS[1] === 'judges' && isJudge )
    return isJudge.name + " is a judge for Book of the Month";
  else if( pathS[1] === 'magazine' && pathS[2] === 'post' && isMagazinePost )
    return isMagazinePost.subtitle;
  else if(!(pathS[1] === "gift" && pathS[2] === "redeem"))
    return typeof pageData.get("/"+pathS[1]) === 'object' ? (pageData.get("/"+pathS[1]))['description'] : defaultText;
  else if(pathS[1] === "gift" && pathS[2] === "redeem")
    return typeof pageData.get(path) === 'object' ? (pageData.get(path))['description'] : defaultText;
  return defaultText;
}

export function getTitle(path, store) {
  let pathS = path.split("/"), defaultText = 'Book of the Month',
      isJudge = judgeExists(pathS[2] || null, store.judges ),
      isMagazinePost = magazinePostExists(pathS[3] || null , store.magazine);
  if(pathS[1] === 'judges' && isJudge )
    return isJudge.name;
  else if( pathS[1] === 'magazine' && pathS[2] === 'post' && isMagazinePost )
    return isMagazinePost.title;
  else if(!(pathS[1] === "gift" && pathS[2] === "redeem"))
    return typeof pageData.get("/"+pathS[1]) === 'object' ? (pageData.get("/"+pathS[1]))['title'] : defaultText;
  else if(pathS[1] === "gift" && pathS[2] === "redeem")
    return typeof pageData.get(path) === 'object' ? (pageData.get(path))['title'] : defaultText;
  return defaultText;
}

export function getRedirect(path) {
  return redirects.get(path);
}

