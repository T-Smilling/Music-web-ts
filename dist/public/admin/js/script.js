// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      const image = URL.createObjectURL(e.target.files[0]);

      uploadImagePreview.src = image;
    }
  });
}
// End Upload Image

// Upload Audio
const uploadAudio = document.querySelector("[upload-audio]");
if(uploadAudio) {
  const uploadAudioInput = uploadAudio.querySelector("[upload-audio-input]");
  const uploadAudioPlay = uploadAudio.querySelector("[upload-audio-play]");
  const source = uploadAudioPlay.querySelector("source");

  uploadAudioInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      const audio = URL.createObjectURL(e.target.files[0]);

      source.src = audio;
      uploadAudioPlay.load();
    }
  });
}
// End Upload Audio

//Button Delete
const buttonDelete=document.querySelectorAll("[button-delete]");
if(buttonDelete.length>0){
  const formDeleted=document.querySelector("#form-delete");
  const path=formDeleted.getAttribute("data-path");
  buttonDelete.forEach(button =>{
    button.addEventListener("click" , () => {
      isConfirm=confirm("Bạn có muốn xóa sản phẩm");
      if(isConfirm){
        const id=button.getAttribute("data-id");
        const action=`${path}/${id}?_method=DELETE`;
        formDeleted.action=action;
        formDeleted.submit();
      }
    });
  });
}

//End Button Delete

const pagination=document.querySelectorAll("[button-pagination]");

if(pagination){
  let url = new URL(window.location.href);
  pagination.forEach(button => {
    button.addEventListener("click", () => {
      const page=button.getAttribute("button-pagination");
      url.searchParams.set("page",page);
      window.location.href=url.href;
    })
  })
}
//End Pagination

const buttonStatus=document.querySelectorAll("[button-status");
if(buttonStatus.length > 0){
  buttonStatus.forEach(button => {
    let url = new URL(window.location.href);
    button.addEventListener("click", () =>{
      const status=button.getAttribute("button-status");
      if(status){
        url.searchParams.set("status",status);
      }
      else{
        url.searchParams.delete("status");
      }
      window.location.href=url.href;
    });
  });
}
// End Status

const sort=document.querySelector("[sort]");
if(sort){
  let url = new URL(window.location.href);
  const sortSelect=sort.querySelector("[sort-select]");
  const sortClear=sort.querySelector("[sort-clear]");
  if(sortSelect){
    sortSelect.addEventListener("change",(e)=>{
      const value=e.target.value;
      const [sortKey,sortValue]=value.split("-");
      url.searchParams.set("sortKey",sortKey);
      url.searchParams.set("sortValue",sortValue);
      window.location.href=url.href;
    })
  }
  sortClear.addEventListener("click",()=>{
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href=url.href;
  })

  const sortKey=url.searchParams.get("sortKey");
  const sortValue=url.searchParams.get("sortValue");
  if(sortKey && sortValue){
    const stringSort=`${sortKey}-${sortValue}`;
    console.log(stringSort);
    const optionSelect=sortSelect.querySelector(`option[value="${stringSort}"]`);
    optionSelect.selected=true;
  }
}
//End Sort

const buttonChangeStatus=document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length>0){
  const formChangeStatus=document.querySelector("#form-change-status");
  const path=formChangeStatus.getAttribute("data-path");
  buttonChangeStatus.forEach(button => {
    button.addEventListener("click" , () =>{
      const statusCurrent=button.getAttribute("data-status");
      const id=button.getAttribute("data-id");
      let statusChange=statusCurrent === "active" ? "inactive" : "active";
      const action= path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action=action;

      formChangeStatus.submit();
    });
  });
}

const checkboxMulti=document.querySelector("[checkbox-multi]");
if(checkboxMulti){
  const inputCheckAll=checkboxMulti.querySelector("input[name='checkall']");
  const inputId=checkboxMulti.querySelectorAll("input[name='id']");
  inputCheckAll.addEventListener("click",() =>{
    if(inputCheckAll.checked){
      inputId.forEach(input =>{
        input.checked=true;
      });
    } else{
      inputId.forEach(input =>{
        input.checked=false;
      });
    }

    inputId.forEach(input =>{
      input.addEventListener("click", () =>{
        const countChecked=checkboxMulti.querySelectorAll(
          "input[name='id']:checked"
        ).length;
        if(countChecked==inputId.length){
          inputCheckAll.checked=true;
        }
        else{
          inputCheckAll.checked=false;
        }
      });
    });

  });
}

// End CheckBox

const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
  formChangeMulti.addEventListener("submit",(e)=>{
    e.preventDefault();
    const checkboxMulti=document.querySelector("[checkbox-multi]");
    const inputChecked=checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const typeChange=e.target.elements.type.value;
    if(typeChange=="delete-all"){
      const isConfirm=confirm("Bạn có muốn xóa sản phẩm");
      if(!isConfirm) return;
    }


    if(inputChecked.length>0){
      let ids=[];
      const inputIds=formChangeMulti.querySelector("input[name='ids']");
      inputChecked.forEach(input =>{
        const id=input.value;
        if(typeChange=="position"){
          const position=input.closest("tr").querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        } else{
          ids.push(id);
        }
      });
      inputIds.value=ids.join(", ");
      formChangeMulti.submit();
    }else{
      alert("Vui lòng nhập một lựa chọn!");
    }
  })
}

//End Change Multi