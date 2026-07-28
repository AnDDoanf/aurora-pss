---
title: "Điều kiện kích hoạt"
order: 12
level: "beginner"
---

### Điều kiện kích hoạt {#điều-kiện-kích-hoạt}

Một cài đặt AI là một phát ngôn dạng `NẾU <ĐIỀU KIỆN> THÌ <HÀNH ĐỘNG>` .

Game thực hiện tính trạng thái toàn bộ trò chơi mỗi giây 40 lần, gọi là 40 frame, tại mỗi framenếu mà `<ĐIỀU KIỆN>` là đúng thì phòng hay crew sẽ nhận `<HÀNH ĐỘNG>` để thực hiện tại frame đó.

*Ta thấy một crew đi từ phòng A sang phòng B hết 1s, trong thực tế, crew đó đã nhận 40 lệnh di chuyển liên tiếp trong 1 gây.*

Dưới đây là ví dụ về một số điều kiện:

![PSS guide illustration 24](/guide-images/vi/dieu-kien-kich-hoat.png)

Trông thì nhiều, nhưng thật ra chỉ có hai ba loại khác nhau:

* Không cần điều kiện, lúc nào cũng làm  
* HP của TÀU như thế nào đó  
* HP của CREW này như thế nào đó  
* HP của PHÒNG này / phòng mà crew đang đứng / phòng thuộc một loại nào đó \- như thế nào đó  
* PHÒNG này / phòng mà crew đang đứng / phòng thuộc một loại nào đó \- có gì đó (có crew mình, có crew địch, không có crew mình, không có crew địch…)

Điều kiện luôn được kiểm tra từ trên xuống, nếu bặn đặt AI như sau:

1. 1\. MỆT thì nghỉ  
2. 2\. KHÔNG \- đứng

Thì chẳng sao, nếu bạn mệt, bạn sẽ nghỉ, nếu bạn không mệt, cài đặt đó không được kích hoạt, và dòng 2 sẽ được kích hoạt, và bạn đứng. Nhưng nếu bạn đặt:

1. 1\. KHÔNG \- đứng  
2. 2\. MỆT thì nghỉ

Điều kiện tại lệnh 1 luôn đúng và bạn sẽ không bao giờ được nghỉ cả. Đó chính là xung đột điều kiện, nó có thể bất lợi, hoặc có lợi, tùy bạn lợi dụng.

Giờ hãy xem một cài đặt cơ bản của phòng MSL (tên lửa):

1. 1\. KHÔNG \- tối đa năng lượng  
2. 2\. KHÔNG \- chọn đồ rẻ  
3. 3\. KHÔNG \- ngắm phòng địch ngẫu nhiên

Chữ KHÔNG ở trên có nghĩa không có điều kiện, hở ra là làm chứ không phải là không được. Và với AI trên, cả ba hành động đều được thực hiện. MSL sẽ bắn bằng đồ rẻ, với năng lượng tối đa, vào phòng địch ngẫu nhiên.

Nâng cấp ví dụ trên:

1. 1\. KHÔNG \- tối đa năng lượng  
2. 2\. KHÔNG \- chọn đồ rẻ  
3. 3\. KHÔNG \- ngắm phòng tên lửa địch  
4. 4\. KHÔNG \- ngắm phòng địch ngẫu nhiên

Tương tự như ví dụ trước, nhưng thao tác NGẮM ở dòng ba đã được lựa chọn, do đó dù cho điều kiện ở dòng 4 vẫn đúng, nhưng phòng của bạn sẽ luôn thực hiện lệnh ở dòng 3 trước nếu như tàu địch có MSL(tên lửa). Như vậy MSL của bạn sẽ bắn vỡ hết phòng tên lửa địch này đến phòng tên lửa địch khác, CHO ĐẾN KHI MÀ PHÒNG CỦA BẠN KHÔNG NGẮM ĐƯỢC PHÒNG TÊN LỬA ĐỊCH NỮA do:

1. Tàu địch không có tên lửa  
2. Tất cả phòng tên lửa địch đã vỡ

… thì khi đó hành động dòng 4 mới được chọn.

Hãy xem xét một ví dụ khác:

1. 1\. KHÔNG \- tối đa năng lượng  
2. 2\. KHÔNG \- chọn đồ rẻ  
3. 3\. HP tàu bạn \< 100% \- ngắm phòng tên lửa địch  
4. 4\. KHÔNG \- ngắm phòng địch ngẫu nhiên

Ở đây, ngay từ đầu trận combat, HP của bạn là 100%, dòng 3 không được kích hoạt, MSL của bạn sẽ bắn phòng ngẫu nhiên, nhưng một khi bạn đã nhận sát thương thân tàu, HP của bạn lúc này sẽ luôn thấp 100% và MSL sẽ bắn phòng tên lửa địch. Tuy vậy, một khi không có phòng tên lửa để mà ngắm nữa, MSL sẽ lại bắn phòng ngẫu nhiên.

Tất nhiên chúng ta không muốn bắn hết phòng này sang phòng khác, chúng ta muốn phá hoại thân tàu, nên chúng ta cần làm gì đó khác.

#### Các nhóm điều kiện hiện tại

Research và các bản vá mới đã bổ sung nhiều điều kiện ngoài HP và sự hiện diện trong phòng:

- **Tàu:** khiên, năng lượng khả dụng, crew hiện diện và phía tàu.
- **Phòng:** HP, EMP, năng lượng được cấp, reload, trạng thái queue, crew trong queue và kiểm tra tổng hợp **all rooms**.
- **Crew:** HP, stamina, combat, healing, queue, đã tới đích và đang ở tàu nào.
- **Đạn:** loại đạn được chọn, số lượng, hết đạn/đang reload, missile đang hoạt động và đạn của vũ khí tích charge.
- **Craft:** số craft phe ta hoặc địch, tách thành assault, defensive và default.
- **Trạng thái/mục tiêu:** loại phòng mục tiêu, superweapon, Bridge, freeze, weaken, vulnerability, suppression, poison và healing.

Điều kiện khả dụng phụ thuộc research và loại phòng/thực thể. Kiểm tra không hợp lệ sẽ bị ẩn nếu thực thể không có năng lượng, mục tiêu, đạn hoặc queue tương ứng.

Nguồn: [V0.999](https://blog.pixelstarships.com/2024/05/16/galaxy-patch-notes-v0-999/), [V0.999.20](https://blog.pixelstarships.com/2025/04/15/galaxy-patch-notes-v0-999-20/), [V0.999.50](https://blog.pixelstarships.com/2026/04/10/galaxy-patch-notes-v0-999-50/) và [V0.999.57](https://blog.pixelstarships.com/2026/07/06/galaxy-patch-notes-v0-999-57/).
