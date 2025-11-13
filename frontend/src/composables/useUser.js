export default function useUser() {
    const fetchUsersAdmin = async () => {
        const response = await fetch('http://localhost:8080/api/admin/user', {
            credentials: 'include',
        });
        if (!response.ok) alert('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        const data = await response.json();
        return data;
    }

    const createUserAdmin = async (userData) => {
        const response = await fetch('http://localhost:8080/api/admin/user', {
            method: 'POST',
            credentials: 'include',
            body: userData,
        });
        if (!response.ok) alert('ไม่สามารถสร้างผู้ใช้ได้');
        const data = await response.json();
        return data;
    }

    const updateUserAdmin = async (id, userData) => {
        const response = await fetch(`http://localhost:8080/api/admin/user/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(userData),
        });
        if (!response.ok) alert('ไม่สามารถอัปเดตผู้ใช้ได้');
        const data = await response.json();
        return data;
    }

    const deleteUserAdmin = async (id) => {
        const response = await fetch(`http://localhost:8080/api/admin/user/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.ok) alert('ลบผู้ใช้สำเร็จ')
        if (!response.ok) alert('ไม่สามารถลบผู้ใช้ได้');
        const data = await response.json();
        return data;
    }

    return {
        fetchUsersAdmin,
        createUserAdmin,
        updateUserAdmin,
        deleteUserAdmin
    }
}