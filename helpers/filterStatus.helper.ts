
export const filterStatusHelper = (query:Record<string,any>) =>{
  interface FilterStatus{
    name:string,
    status:string,
    class:string,
  };
  let filterStatus:FilterStatus[]=[
    {
      name: "Tất cả",
      status: "",
      class:""
    },
    {
      name: "Hoạt động",
      status: "active",
      class:""
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class:""
    }
  ];
  if(query.status){
    const index:number=filterStatus.findIndex(item => item.status==query.status);
    filterStatus[index].class="active";
  } else{
    const index:number=filterStatus.findIndex(item => item.status=="");
    filterStatus[index].class="active";
  }
  return filterStatus;
}