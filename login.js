$('#form').find('input, textarea').on('keyup blur focus', function (e) {
  var $this = $(this),
    label = $this.prev('label');

  if (e.type === 'keyup') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.addClass('active highlight');
    }
  } else if (e.type === 'blur') {
    if ($this.val() === '') {
      label.removeClass('active highlight');
    } else {
      label.removeClass('highlight');
    }
  } else if (e.type === 'focus') {

    if ($this.val() === '') {
      label.removeClass('highlight');
    }
    else if ($this.val() !== '') {
      label.addClass('highlight');
    }
  }

});

$('.tab a').on('click', function (e) {
  e.preventDefault();

  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');

  target = $(this).attr('href');

  $('.tab-content > div').not(target).hide();

  $(target).fadeIn(800);

});

document.getElementById("loginForm").addEventListener("submit", (function (e) {
  e.preventDefault();
  const email = document.getElementById("emailLogin").value;
  const password = document.getElementById("pLogin").value;
  console.log({ email, password });
  fetch("https://dev.thanqminh.com:3001/auth/sign_in", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (response) => {
    if (response.status != 200) {
      return window.alert("Login failed");;
    }
    const data = await response.json();
    window.localStorage.setItem("hAccessToken", response.headers.get("access-token"));
    window.localStorage.setItem("client", response.headers.get("client"));
    window.localStorage.setItem("uid", response.headers.get("uid"));
    window.localStorage.setItem("userData", JSON.stringify(data));
    window.location.href = "todolist.html";
  }).catch((err) => {
    console.log("Login failed", err);
    window.alert("Login failed");
  })
}));


document.getElementById("signupForm").addEventListener("submit", (function (e) {
  e.preventDefault();
  const email = document.getElementById("emailSignup").value;
  const password = document.getElementById("passwordSignup").value;
  console.log({ email, password });
  fetch("https://dev.thanqminh.com:3001/auth", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(async (response) => {
    if (response.status != 200) {
      return window.alert("Signup failed");;
    }
    await response.json();
    window.alert("Signup suceesfully");
  }).catch((err) => {
    console.log("Login failed", err);
    window.alert("Signup failed");
  })
}));