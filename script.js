let mode="video";

function setMode(m){
  mode=m;
  btnVideo.classList.remove("active");
  btnPhoto.classList.remove("active");
  if(m==="video")btnVideo.classList.add("active");
  if(m==="photo")btnPhoto.classList.add("active");
}

async function forceDownload(url, filename){
  try{
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }catch(e){
    alert("Gagal download otomatis, buka manual.");
    window.open(url,"_blank");
  }
}

async function downloadTT(){
  const url=tiktokUrl.value;
  if(!url){result.innerHTML="Masukkan link TikTok dulu!";return;}
  result.innerHTML="";
  loading.classList.remove("hidden");

  try{
    const api=`https://tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res=await fetch(api);
    const data=await res.json();
    loading.classList.add("hidden");

    if(!data.data){result.innerHTML="Gagal ambil data.";return;}

    if(mode==="video"){
      const v=data.data.play;
      result.innerHTML=`
        <video controls src="${v}"></video>
        <button class="download-btn" onclick="forceDownload('${v}','video.mp4')">
          Download Video
        </button>`;
    }else{
      const photos=data.data.images;
      if(!photos||photos.length===0){
        result.innerHTML="Ini bukan slide foto.";
        return;
      }
      let html=`<div class="photo-scroll">`;
      photos.forEach((img,i)=>{
        html+=`
          <div class="photo-item">
            <div class="photo-view">
              <img src="${img}">
            </div>
            <button class="download-btn"
              onclick="forceDownload('${img}','foto-${i+1}.jpg')">
              Download Foto ${i+1}
            </button>
          </div>`;
      });
      html+=`</div>`;
      result.innerHTML=html;
    }
  }catch(e){
    loading.classList.add("hidden");
    result.innerHTML="Error ambil data.";
  }
}