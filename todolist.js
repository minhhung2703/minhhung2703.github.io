window.addEventListener('load', () => {
  function fetchWithCredential(url, method, data) {
    const credential = window.localStorage.getItem('hAccessToken');
    const client = window.localStorage.getItem("client");
    const uid = window.localStorage.getItem("uid");
    return new Promise((resolve, reject) => {
      fetch("https://dev.thanqminh.com:3001" + url, Object.assign({
        method,
        headers: {
          "Content-Type": "application/json",
          "access-token": credential,
          client,
          uid,
        },

      }, data ? { body: data ? JSON.stringify(data) : null, } : {})).then((res) => res.json()).then((response) => {
        resolve(response);
      }).catch((err) => reject(err))
    });
  }

  const form = document.querySelector("#new-task-form");
  const input = document.querySelector("#new-task-input");
  const list_el = document.querySelector("#tasks");

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const task = input.value;
    try {
      const addTaskResponse = await fetchWithCredential("/task_lists", "POST", { name: task });
      console.log(addTaskResponse);
      addUI(addTaskResponse.name, addTaskResponse.id);
      setSuccessMessage(addTaskResponse.name)
      clearFormData();
      getData(); // reload table 
    } catch { };
  });

  function addUI(task, id) {
    const task_el = document.createElement('div');
    task_el.classList.add('task');

    const task_content_el = document.createElement('div');
    task_content_el.classList.add('content');

    task_el.appendChild(task_content_el);

    const task_input_el = document.createElement('input');
    task_input_el.classList.add('text');
    task_input_el.type = 'text';
    task_input_el.value = task;
    task_input_el.setAttribute('readonly', 'readonly');

    task_content_el.appendChild(task_input_el);

    const task_actions_el = document.createElement('div');
    task_actions_el.classList.add('actions');

    const task_edit_el = document.createElement('button');
    task_edit_el.classList.add('edit');
    task_edit_el.innerText = 'Edit';

    const task_delete_el = document.createElement('button');
    task_delete_el.classList.add('delete');
    task_delete_el.innerText = 'Delete';

    task_actions_el.appendChild(task_edit_el);
    task_actions_el.appendChild(task_delete_el);

    task_el.appendChild(task_actions_el);

    list_el.appendChild(task_el);

    input.value = '';

    task_edit_el.addEventListener('click', async (e) => {
      if (task_edit_el.innerText.toLowerCase() == "edit") {
        task_edit_el.innerText = "Save";
        task_input_el.removeAttribute("readonly");
        task_input_el.focus();
      } else {
        task_edit_el.innerText = "Edit";
        task_input_el.setAttribute("readonly", "readonly");
        console.log(task_input_el.value);
        try {
          await fetchWithCredential("/task_lists/" + id, "PATCH", { name: task_input_el.value });
        } catch (err) {
          list_el.removeChild(task_el);
        }
      }
    });

    task_delete_el.addEventListener('click', async (e) => {
      try {
        await fetchWithCredential("/task_lists/" + id, "DELETE");
        list_el.removeChild(task_el);
      } catch (err) {
        list_el.removeChild(task_el);
      }
    });
  }

  async function get() {
    try {
      const response = await fetchWithCredential("/task_lists", "GET");
      response.map((item) => {
        addUI(item.name, item.id);
      })
    } catch { }
  }

  get();
})
