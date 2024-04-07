// Lưu dữ liệu vào cookies
function setSessionCookie(name, value) {
  document.cookie = name + "=" + value + "; path=/";
}

//APlayer
const elementAplayer = document.querySelector("#aplayer");
if(elementAplayer){
  let dataSong=elementAplayer.getAttribute("data-song");
  dataSong=JSON.parse(dataSong);
  let dataSinger=elementAplayer.getAttribute("data-singer");
  dataSinger=JSON.parse(dataSinger);
  const ap = new APlayer({
    container: elementAplayer,
    lrcType: 1,
    audio: [{
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
        lrc: dataSong.lyrics
    }],
    autoplay: true
  });

  const avatar=document.querySelector(".singer-detail .inner-avatar");
  // ap.on('ended', function () {
  //   const link = `/songs/listen/${dataSong._id}`;
  //   fetch(link, {
  //     method: "PATCH"
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data);
  //     })
  // });
  ap.on('play', function () {
    avatar.style.animationPlayState = "running";
  });

  ap.on('pause', function () {
    avatar.style.animationPlayState = "paused";
  });
}
//End APlayer

// Button Like
const buttonLike=document.querySelector("[button-like]");
if(buttonLike){
  buttonLike.addEventListener("click",()=>{
    const isActive = buttonLike.classList.contains("active");
    const typeLike=(isActive==true ? "no" : "yes");
    const idSong=buttonLike.getAttribute("button-like");
    const link =`/songs/like/${typeLike}/${idSong}`;
    fetch(link, {
      method:"PATCH"
    })
      .then(res=>res.json())
      .then(data =>{
        const spanLike=buttonLike.querySelector("[data-like]");
        spanLike.innerHTML=data.like;
        buttonLike.classList.toggle("active")
      })
  })
}
//End Button Like

//Account Register
const formRegister=document.querySelector(".user-register");
if(formRegister){
  formRegister.addEventListener("submit",(e)=>{
    e.preventDefault();
    const fullName=document.querySelector("#fullName").value;
    const email=document.querySelector("#email").value;
    const password=document.querySelector("#password").value;
    dataToSend={
      fullName:fullName,
      email:email,
      password:password
    }
    const link="/user/register";
    const option={
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    }
    fetch(link, option)
      .then(response => response.json())
      .then(data => {
        if(data.code==200){
          const token="token";
          const dataToken=data.token;
          setSessionCookie(token,dataToken);
          window.location.href = "login"
        }
        else{
          location.reload();
        }
      });
  })
}

//End Account Register

//Account Login
const formLogin=document.querySelector(".user-login");
if(formLogin){
  formLogin.addEventListener("submit",(e)=>{
    e.preventDefault();
    const email=document.querySelector("#email").value;
    const password=document.querySelector("#password").value;
    dataToSend={
      email:email,
      password:password
    }
    const link="/user/login";
    const option={
      method:"POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    }
    fetch(link, option)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if(data.code==200){
          const token=data.token;
          const tokenUser="tokenUser";
          setSessionCookie(tokenUser,token);
          const option2={
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
          fetch(link,option2)
            .then(response => response.json())
            .then(data => {
              console.log("SendOk");
            });
          window.location.href = "/topics"
        }
      });
  })
}
//End Account Login

// buttonFavorite
const listButtonFavorite = document.querySelectorAll("[button-favorite]");
if(listButtonFavorite.length > 0) {
  listButtonFavorite.forEach(buttonFavorite => {
    buttonFavorite.addEventListener("click", () => {
      const isActive = buttonFavorite.classList.contains("active");
  
      const typeFavorite = isActive ? "no" : "yes";
  
      const idSong = buttonFavorite.getAttribute("button-favorite");
      const link = `/songs/favorite/${typeFavorite}/${idSong}`;
      fetch(link, {
        method: "PATCH"
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          buttonFavorite.classList.toggle("active");
        })
    });
  })
}
//End buttonFavorite
