import React, { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function TodoList() {
    const [taskList, setTaskList] = useState([]);
    const [addTask, setAddTask] = useState([]);
    const [isOpenDilog, setIsOpenDilog] = useState(false);
    let updateName = useRef("");
    let updaterName = useRef("");

    useEffect(() => {
        fetchList();
    }, [])
    const fetchList = async () => {

        fetch('https://jsonplaceholder.typicode.com/todos')
            .then((res) => res.json())
            .then((data) => {
                let tempArr = [];
                data.map((ele) => {
                    tempArr.push(ele.title);
                })
                setTaskList(tempArr);
            })
            .catch((err) => {
                console.log(err.message);
            });

    }

    const addTaskHandeler = () => {
        fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            body: JSON.stringify({
                title: addTask,
                completed: true,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((res) => res.json())
            .then((post) => {
                console.log(post)
                setTaskList([...taskList, post.title])
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const inputHandeler = (e) => {
        if (e.target.value) {
            setAddTask(e.target.value);
        }
    }

    const deleteButtonHandeler = (e) => {

        fetch(`https://jsonplaceholder.typicode.com/todos/${e}`, {
            method: 'DELETE'
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.error(error));

        if (taskList.includes(e)) {
            let index = taskList.indexOf(e);
            if (index > -1) { // only splice array when item is found
                taskList.splice(index, 1); // 2nd parameter means remove one item only
            }
        }
        setTaskList([...taskList]);


    }

    const updateButtonHandeler = (e) => {

        setIsOpenDilog(true);
        updaterName.current = e;
    }

    const handleClose = () => {
        setIsOpenDilog(false);
    }

    const updateInputHandeler = (e) => {
        updateName.current = e.target.value;
    }

    const finalUpdateName = () => {


        fetch(`https://jsonplaceholder.typicode.com/todos/1`, {
            method: 'PUT',
            body: JSON.stringify({
                title: updateName.current,
                body: 'bar',
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then((json) => console.log(json));


        if (updaterName.current && taskList.includes(updaterName.current)) {
            let index = taskList.indexOf(updaterName.current);
            if (index > -1) { // only splice array when item is found
                taskList[index] = updateName.current; // 2nd parameter means remove one item only
            }
        }
        setTaskList([...taskList]);
        setIsOpenDilog(false);
    }


    return (
        <>
            <h1 className='navbar'>TodoList</h1>
            <div className='maincontainer'>
                <div className='addInputbtn'>
                    <input style={{ width: "300px", marginRight: "10px" }} placeholder='New Task Here..' onChange={inputHandeler} />
                    <button style={{ width: "100px", cursor: "pointer" }} onClick={addTaskHandeler}>Add Task</button>
                </div>
                {taskList.length &&
                    <div className='listcontainer'>
                        <ul>
                            {taskList.map((ele) => {
                                return (
                                    <>
                                        <div className='mainList'>
                                            <div className='childList'>
                                                <li>{ele}
                                                </li>
                                            </div>
                                            <div className='btnList'>
                                                <button style={{ backgroundColor: "#ccebec", cursor: "pointer", marginRight: "3px" }} onClick={() => { updateButtonHandeler(ele) }}>Update</button>
                                                <button style={{ backgroundColor: "#ccebec", cursor: "pointer" }} onClick={() => { deleteButtonHandeler(ele) }}>Delete</button>
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </ul>
                    </div>
                }


                <Modal
                    open={isOpenDilog}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <h3>Update Task Name</h3>
                        <input style={{ float: "left" }} placeholder='Enter Update Name' onChange={updateInputHandeler} /><br /><br />
                        <button style={{ marginRight: "18px", cursor: "pointer" }} onClick={finalUpdateName}>Update </button>
                        <button style={{ cursor: "pointer" }} onClick={handleClose}> Close</button>
                    </Box>
                </Modal>

            </div>
        </>
    )
}
