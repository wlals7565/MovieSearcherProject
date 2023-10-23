let movies= {};

class View{
    //생성자는 클래스 이름만 가진다.
    constructor(className){
        this.className = className;
        this.page = 0;

    }
    //영화를 하나하나 넣는다.
    addMovie(url,title, intro, rating){
        // 새로운 .box 요소를 생성합니다.
        let newBox = document.createElement("div");
        newBox.className = "box";
    
        // .box 요소의 내용을 설정합니다.
        newBox.innerHTML = `
        <a  class="image fit">
            <img src="https://image.tmdb.org/t/p/w500${url}" alt="" width="600" height="338">
        </a>
        <div class="inner">
            <h3 style="height: 60px">${title}</h3>
            <p style="text-align: left; height: 200px; overflow: auto;">${intro}</p>
            <p style="text-align: left;">평점: ${rating}</p>
            <a href="https://www.youtube.com/results?search_query=${title}" class="button fit" data-poptrox="youtube,800x400">유튜브로 보기</a>
        </div>
        `;
    
        // .thumbnails 요소를 선택합니다.
        let thumbnails = document.querySelector(`.${this.className}`);
    
        // 새로운 .box 요소를 .thumbnails 요소의 자식으로 추가합니다.
        thumbnails.appendChild(newBox);
    }
    //페이지를 채웁니다.
    fillPage(movies){
        for(let i=0; i<movies.length; i++ ){
            this.addMovie(movies[i].poster_path, movies[i].title, movies[i].overview, movies[i].vote_average)
        }

    }
    //페이지를 비웁니다.
    clearPage(){
        let thumbnails = document.querySelector(`.${this.className}`); // 부모 요소 선택

        // 부모 요소의 자식 요소를 모두 제거
        while (thumbnails.firstChild) {
            thumbnails.removeChild(thumbnails.firstChild);
        }
    }

    //페이지를 초기화합니다.
    initPage(){
        this.page=0;
    }

}

class Controller{
    constructor(view, model){
        this.view = view;
        this.model = model;
    }
    async showMain(){
        await this.model.initOriginalMovies();
        this.view.fillPage(this.model.cloneMovies[this.view.page]);
    }

    pageDown(){
        if(this.model.cloneMovies[this.view.page-1]){
            this.view.page -=1;
            this.view.clearPage();
            this.view.fillPage(this.model.cloneMovies[this.view.page]);
            return true;
        }
        else{
            return false;
        }
    }
    pageUp(){
        if(this.model.cloneMovies[this.view.page+1]){
            this.view.page +=1;
            this.view.clearPage();
            this.view.fillPage(this.model.cloneMovies[this.view.page]);
            return true;
        }
        else{
            return false;
        }
    }

    query(query){
        this.model.query(query);
        this.view.initPage();
        this.view.clearPage();
        this.view.fillPage(this.model.cloneMovies[this.view.page]);
    }


}
//데이터를 저장하고 관리하고 처리하는데 모델입니다.
class Model{
    //생성자 입니다.
    constructor(){
        this.options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZTBkNTM3ZjFjYzZjYjY4ODA1Nzg1MjM3OWQxZWZlOSIsInN1YiI6IjY1MmY4ZDA1Yzk5NWVlMDBjNmUzMDJkMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.19mDAaUNjwD7vMiTAJevVf1JFt4HcCQc_ZoavKj3AGI'
            }
        }
        //데이터베이스를 가장한 객체로
        //API에서 가져온 1~10페이지의 영화들을 가지고 있습니다.
        this.originalMovies = [];
        //데이터베이스에서 특정 대상만 찾기 위해 쓰는 객체로
        //originalMovies에 조작을 가해 유저가 원하는 영화리스트를 가지게 됩니다.
        this.cloneMovies = [];

    }
    //originalMovies를 초기화합니다. 1~10페이지 영화를 가지게 합니다.
    async initOriginalMovies(){
            for(let i=1; i<11; i++){        
            let response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${i}`, this.options)
            response = await response.json();
            this.originalMovies.push(response.results);
        }
        this.cloneMovies = this.originalMovies;
    }
    //사용자가 입력한 제목이 들어있는 영화들을 찾습니다.
    query(title){
        this.cloneMovies = [];
        let array= [];
        let count =0;
        for(let i=0; i<10; i++){
            for(let j=0; j<20; j++){
                if(this.originalMovies[i]){
                    if(this.originalMovies[i][j].title.toLowerCase().includes(title.toLowerCase())){
                        array.push(this.originalMovies[i][j]);
                        count++;
                        if(count == 20){
                            this.cloneMovies.push(array.slice());
                            count = 0;
                            array=[];
                        }
                    }
                }
            }
        }
        if(array.length != 0){
            this.cloneMovies.push(array.slice());
        }
    }

    

}
/**********************************************************************************************************************************/
//0.0.1v
/*
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
    let thumbnails = document.querySelector(".thumbnails"); // 부모 요소 선택

    // 부모 요소의 자식 요소를 모두 제거
    while (thumbnails.firstChild) {
        thumbnails.removeChild(thumbnails.firstChild);
    }
}


//영화 하나를 넣는다.
function addMovie(className,url,title, intro, rating){
    // 새로운 .box 요소를 생성합니다.
    let newBox = document.createElement("div");
    newBox.className = "box";

    // .box 요소의 내용을 설정합니다.
    newBox.innerHTML = `
    <a  class="image fit">
        <img src="https://image.tmdb.org/t/p/w500${url}" alt="" width="600" height="338">
    </a>
    <div class="inner">
        <h3>${title}</h3>
        <p style="text-align: left; height: 300px">${intro}</p>
        <p style="text-align: left;">${rating}</p>
        <a href="https://www.youtube.com/results?search_query=${title}" class="button fit" data-poptrox="youtube,800x400">유튜브로 보기</a>
    </div>
    `;

    // .thumbnails 요소를 선택합니다.
    let thumbnails = document.querySelector(`.${className}`);

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

}*/