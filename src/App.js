import React, { useEffect, useState } from "react";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./firebase";
import { Button, Input, makeStyles, Modal } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";

import Avatar from "@material-ui/core/Avatar";

function backToTop() {
  // document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [openImageUpload, setOpenImageUpload] = useState(false);
  const [viewwhichuser, setViewWhichUser] = useState("");
  const [viewsinglepost, setViewSinglePost] = useState(false);
  const [viewmine, setViewMine] = useState(false);

  function home() {
    setViewMine(false);
    setViewWhichUser("");
    setViewSinglePost(false);
    backToTop();
  }

  useEffect(() => {
    const unsuscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // auth has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // aut has logged out
        setUser(null);
      }
    });
    return () => {
      unsuscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setPosts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        )
      );
  }, []);

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram"
                className="app__headerImage"
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>
              Sign up
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="instagram"
                className="app__headerImage"
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      <header className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="instagram"
          className="app__headerImage"
        />

        <div className="loginLeft">
          {user ? (
            <Button onClick={() => auth.signOut()}>Logout</Button>
          ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign up</Button>
            </div>
          )}
        </div>
      </header>
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageURL={post.imageURL}
            />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/BzNbnJXBe8m/"
            clientAccessToken="123|456"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>
      {/* {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}*/}{" "}
      <footer className="footer">
        {/* This is where people can upload stuff */}
        {/* below line used to be user?.displayName ? (  - but it was giving issues so i changed it */}
        {user ? (
          <div>
            <Modal
              open={openImageUpload}
              onClose={() => setOpenImageUpload(false)}
            >
              <ImageUpload
                username={user.displayName}
                closemodal={setOpenImageUpload}
                // Passing the 2 below so that I can reset those once upload is done
                viewwhichuser={setViewWhichUser}
                viewsinglepost={setViewSinglePost}
              />
            </Modal>

            <div className="footer__icons">
              <div className="footer__left">
                <div className="app__home">
                  <HomeOutlinedIcon onClick={home} />
                </div>
              </div>

              <div className="footer__middle">
                <div className="app__add-postImg">
                  <AddCircleOutlineOutlinedIcon
                    onClick={() => setOpenImageUpload(true)}
                    alt="plus icon to add posts"
                  />
                </div>
              </div>

              <div className="footer__right">
                <Avatar
                  onClick={() => {
                    setViewMine(true);
                    backToTop();
                  }}
                  className="footer__avatar"
                  alt={username}
                  src="https://toogreen.ca/instagreen/static/images/avatar/1.jpg"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="footer__icons">
            <div className="footer__left">
              <div className="app__home">
                <HomeOutlinedIcon onClick={home} />
              </div>
            </div>
            <div className="footer__middle">
              <Button onClick={() => setOpenSignIn(true)}>
                SIGN IN &nbsp;&nbsp;
              </Button>
              <Button onClick={() => setOpen(true)}>SIGN UP</Button>
            </div>
            <div className="footer__right">&nbsp;</div>
          </div>
        )}
      </footer>
    </div>
  );
}

export default App;
