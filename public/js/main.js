const infoEl = document.querySelector('#info')
const contentsEl = document.querySelector('#contents')
const loadingEl = document.querySelector('#loading')
const loadingEl_c = document.querySelector('#loading_c')
let loading = false


// contentsのデータを読み込む
const getContentsFromBackend = async() => {
    loading = true
    const res = await fetch('http://localhost:5000/contents')
    const data = await res.json()
    loading = false
    return data
}

const addContentsToDom = async () => {
    const contents = await getContentsFromBackend()

    if (!loading){
        loadingEl_c.innerHTML = ''
    }

    // forEachは与えられた関数の各要素に対して一度ずつ実行する
    // latest_contentsは最大5つとかにしたいのでそれ以上はとらないようにしたい
    // テーブルデータのpage_id群を取得 res.results
    // page_idのNameを取得 res.results[i].properties.Name.title[0].plain_text
    // page_idのURLを取得 res.results[i].properties.URL.url
    // page_idのTagを取得 res.results[i].properties.Tags.select.name
    // page_idの日にちを取得 res.results[i].properties.Column.date.start
    contents.forEach((content) => {
        const div = document.createElement('div')
        div.innerHTML = `
        <a href=${content.properties.URL.url} class="list-group-item list-group-item-action py-3 lh-tight" aria-current="true" style="border-width:0cm" target="blank" rel="noopener noreferrer">
            <div class="d-flex w-100 align-items-center justify-content-between">
                <h3 class="mb-1">・${content.properties.Name.title[0].plain_text}</h3>
                <p>${content.properties.Column.date.start}</p>
            </div>
        <div class="badge bg-secondary">${content.properties.Tags.select.name}</div>
        </a>
        `
        contentsEl.appendChild(div)
    })
}


// infoのデータを読み込む
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
                        <a href=${info_.url.rich_text[0].plain_text} target="blank" rel="noopener noreferrer">
                            <img src=${info_.Property.files[0].file.url} class="card-img-top" alt=${info_.Name.title[0].plain_text} style="text-align: center">
                        </a>
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

addContentsToDom()
addinfoToDom()

{/* <h3>${info_.Name.title[0].plain_text}</h3>
<p><a href=${info_.url.rich_text[0].plain_text} target="blank" rel="noopener noreferrer">See more</a></p>
<img src=${info_.Property.files[0].file.url} width="400" height="400"></img> */}
