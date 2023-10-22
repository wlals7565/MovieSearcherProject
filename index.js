let movies= {};

function showMovies(){
    initPage();
    for(let i=0; i<20; i++ ){
        addMovie("thumbnails", movies[i].poster_path, movies[i].title, movies[i].overview, movies[i].vote_average)
    }
}

function searchMovies(query){
    initPage();
    for(let i=0; i<20; i++ ){
        if (movies[i].title.toLowerCase().includes(query.toLowerCase())){
            addMovie("thumbnails", movies[i].poster_path, movies[i].title, movies[i].overview, movies[i].vote_average)
        };
    }
}

function initPage(){
    var thumbnails = document.querySelector(".thumbnails"); // 부모 요소 선택

    // 부모 요소의 자식 요소를 모두 제거
    while (thumbnails.firstChild) {
        thumbnails.removeChild(thumbnails.firstChild);
    }
}


//영화 하나를 넣는다.
function addMovie(className,url,title, intro, rating){
    // 새로운 .box 요소를 생성합니다.
    var newBox = document.createElement("div");
    newBox.className = "box";

    // .box 요소의 내용을 설정합니다.
    newBox.innerHTML = `
    <a  class="image fit">
        <img src="https://image.tmdb.org/t/p/w500${url}" alt="" width="600" height="338">
    </a>
    <div class="inner">
        <h3>${title}</h3>
        <p style="text-align: left; height: 200px;">${intro}</p>
        <p style="text-align: left;">${rating}</p>
        <a href="https://www.youtube.com/results?search_query=${title}" class="button fit" data-poptrox="youtube,800x400">유튜브로 보기</a>
    </div>
    `;

    // .thumbnails 요소를 선택합니다.
    var thumbnails = document.querySelector(`.${className}`);

    // 새로운 .box 요소를 .thumbnails 요소의 자식으로 추가합니다.
    thumbnails.appendChild(newBox);
}


//해당 페이지의 영화들을 가져온다.
async function getMovies(page){
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZTBkNTM3ZjFjYzZjYjY4ODA1Nzg1MjM3OWQxZWZlOSIsInN1YiI6IjY1MmY4ZDA1Yzk5NWVlMDBjNmUzMDJkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.19mDAaUNjwD7vMiTAJevVf1JFt4HcCQc_ZoavKj3AGI'
        }
    };
    
    let response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`, options)
    response = await response.json();
    movies = response.results;
    
}

function Init(){

}