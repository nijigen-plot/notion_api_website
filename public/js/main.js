const infoEl = document.querySelector('#info')
const loadingEl = document.querySelector('#loading')
let loading = false

// 
const getinfoFromBackend = async() => {
    loading = true
    const res = await fetch('http://localhost:5000/info')
    const data = await res.json()
    loading = false
    return data
}


const addinfoToDom = async () => {
    const info = await getinfoFromBackend()

    if (!loading){
        loadingEl.innerHTML = ''
    }

    // forEachは与えられた関数を配列の各要素に対して一度ずつ実行する
    // タイトルテキストを取得 info_.Name.title[0].plain_text
    // URLを取得 info_.url.rich_text[0].plain_text
    // 画像を取得 info_.Property.files[0].file.url
    info.forEach((info_) => {
        const div = document.createElement('div')
        // div.className = 'info'
        div.innerHTML = `
            <div class="col">
                <div class="card mb-4 shadow-sm ">
                    <div style="text-align: center">
                        <img src=${info_.Property.files[0].file.url} class="card-img-top" alt=${info_.Name.title[0].plain_text} style="text-align: center">
                    </div>
                        <div class="card-body">
                        <h5 class="card-title">${info_.Name.title[0].plain_text}</h5>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                <a class="btn btn-sm btn-outline-secondary" href=${info_.url.rich_text[0].plain_text} target="blank" rel="noopener noreferrer" role="button" >See More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
        infoEl.appendChild(div)
    })
}

addinfoToDom()

{/* <h3>${info_.Name.title[0].plain_text}</h3>
<p><a href=${info_.url.rich_text[0].plain_text} target="blank" rel="noopener noreferrer">See more</a></p>
<img src=${info_.Property.files[0].file.url} width="400" height="400"></img> */}
