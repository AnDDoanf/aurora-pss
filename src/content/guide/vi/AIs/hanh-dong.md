---
title: "Hành động"
order: 13
level: "beginner"
---

### Hành động {#hành-động}

![PSS guide illustration 25](/guide-images/vi/hanh-dong.png)

Khi điều kiện được khớp thì hành động được thực hiện, có khá nhiều cài đặt hành động, nhưng tựu trung lại có mấy nhóm:

* Quản lý năng lượng (AI phòng)  
* Chọn loại đạn (AI phòng)  
* Chọn mục tiêu (cả phòng lẫn crew đều có)  
* Sử dụng năng lực (AI của crew)

#### Khi nào thì HÀNH ĐỘNG được bỏ qua

* Điều kiện không khớp thì hành động không được thực hiện  
* Phòng mục tiêu không tồn tại, đã hết HP, đang nâng cấp, hay không thể đi đến được (do không có đường, thang, ống thông, trong trường hợp đặt AI cho crew) thì hành động không được thực hiện  
* Một HÀNH ĐỘNG cùng loại (một trong 4 loại được liệt kê ở trên) đã được chọn để thực thi

#### Điều gì xảy ra khi không có HÀNH ĐỘNG “ngắm” nào thỏa mãn

Nếu như không có lệnh chọn mục tiêu nào được chọn thì phòng súng sẽ tiếp tục bắn phòng cuối cùng mà nó bắn. Nếu như ngay từ đầu đã không có điều kiện để ngắm mục tiêu nào thỏa mãn thì phòng hay crew sẽ không làm gì cả.

#### Tăng giảm 1 năng lượng và đặt tối thiểu / tối đa năng lượng

Câu lệnh “tăng 1 năng lượng” gần như đồng nghĩa với lệnh “đặt tối đa năng lượng” cho phòng. Điểm khác biệt là bạn sẽ không thể nhận biết được sự tăng năng lượng đối với lệnh “đặt tối đa năng lượng” và lệnh này có quyền ưu tiên thực hiện cao hơn lệnh tăng 1 năng lượng.

Trong trường hợp tàu bạn không đủ năng lượng để set tất cả các phòng ở trạng thái năng lượng cao nhất, thì các phòng “đặt tối đa năng lượng” sẽ được ưu tiên tập trung năng lượng. Còn các phòng “tăng 1 năng lượng” sẽ chia đều với nhau phần năng lượng còn lại.

Tương tự như trên thì lệnh giảm 1 năng lượng cũng sẽ có tác dụng giống hệt như lệnh đặt mức năng lượng thấp nhất, và vì vòng lặp AI chạy rất nhanh nên bạn cũng không thể nhận biết được sự thay đổi.

#### Ví dụ thực tế

Giờ quan sát một ví dụ thực tế:

1. KHÔNG: đặt tối đa năng lượng  
2. KHÔNG: chọn đồ rẻ  
3. KHÔNG: ngắm phòng ngẫu nhiên

AI này sẽ bắn vỡ hết phòng này đến phòng khác, và chúng ta không muốn điều đó (hãy đọc các bài về nghệ thuật quân sự), vậy nên chúng ta sẽ chọn một phòng cụ thể, để ngắm:

1. KHÔNG: đặt tối đa năng lượng  
2. KHÔNG: chọn đồ rẻ  
3. KHÔNG: ngắm phòng lazer địch

AI trên tốt hơn một chút, nhưng vẫn chưa đủ. Sau khi bắn vỡ phòng lazer, MSL sẽ bắn phòng lazer khác, cho đến khi hết, và sẽ rất thảm họa nếu phía địch có crew đi sửa (chắc chắn rồi). Thế nên chúng ta chọn một loại phòng mà chỉ có một hoặc hai phòng:

1. KHÔNG: đặt tối đa năng lượng  
2. KHÔNG: chọn đồ rẻ  
3. KHÔNG: ngắm phòng khiên địch

Ở AI trên, khi phòng khiên địch đã vỡ, MSL không có cài đặt AI nào bảo nó bắn phòng gì nữa cả, và nó sẽ bắn phòng cuối cùng mà nó vừa nhận lệnh bắn, tức là bắn phòng khiên địch mãi, và gây ra sát thương thân tàu – điều chúng ta muốn.

\*AI trên có nhược điểm là nếu tàu địch không có phòng khiên (do địch không lắp đặt) thì MSL sẽ không bắn phòng nào cả. Tuy vậy trường hợp đó ít khi xảy ra, giải pháp triệt để là có nhưng đó không phải là nội dung “cơ bản”, và không nằm trong bài viết này.

Về AI cho crew, có một số lưu ý như sau:

1. ĐIỀU KIỆN của crew AI không khác biệt nhiều so với AI phòng.  
2. Hành động chọn mục tiêu sẽ chỉ ra nơi crew chạy tới.  
3. Một khi đã chạy tới một phòng bạn, crew sẽ thực hiện bốn công việc sau, tự động, và theo thứ tự ưu tiên:  
   1. Bem crew địch nếu có.  
   2. Dập lửa nếu có.  
   3. Sửa phòng nếu cần.  
   4. Sử dụng chỉ số của mình để hỗ trợ phòng hoạt động tốt hơn.  
4. Một khi đã chạy tới một phòng địch, crew sẽ thực hiện một trong hai công việc sau, theo thứ tự ưu tiên:  
   1. Bem crew địch nếu có.  
   2. Phá hoại phòng.  
5. Lưu ý rằng những công việc trên là tự động, và có thứ tự ưu tiên, không xảy ra đồng thời (vậy nên nếu như một phòng đang cháy mà có địch đứng thì phòng sẽ không nhận được sự hỗ trợ từ crew).  
6. Ngoài các công việc kể trên, crew còn có thể sử dụng năng lực, và tùy thuộc và đặc tính của năng lực mà có thể gây ảnh hưởng hoặc không ảnh hưởng lên phòng.  
7. Phải có đường đi thì crew mới đi được.

Bạn hãy xem thử một ví dụ về crew AI và suy ngẫm xem nó làm gì:

1. HP phòng khiên bạn \< 100%: chọn phòng thỏa mãn điều kiện  
2. HP phòng ngẫu nhiên \< 50%: chọn phòng thỏa mãn điều kiện  
3. KHÔNG: chọn phòng MLZ

Giả sử Crew đang đứng ở phòng MLZ và đang cải thiện (buff) tốc độ bắn của phòng. Lúc này phòng REA của bạn bị hỏa lực của địch bắn vào và HP của REA đã giảm xuống hơn 50%. Lúc này vì phòng khiên của bạn vẫn đang bình an nên crew sẽ chạy đến sửa REA, trong lúc chạy đến thì REA đã bị phá hủy hoàn toàn và nhận sát thương lên thân tàu. Crew bạn tiến hành sửa REA cho đến khi REA được 50% HP thì dòng 2 sẽ không thỏa điều kiện nữa và crew sẽ quay lại MLZ. Đến đây chắc các bạn cũng đã hiểu, tiếp tục giả sử như REA đã bị phá hủy và địch tiếp tục ngắm bắn phòng khiên của bạn, ngay lúc này vì dòng 1 có độ ưu tiên cao hơn cho nên Crew của bạn sẽ quay quắt 180 độ để đến phòng khiên thực hiện việc sửa chữa trước, mặc cho REA đã bị phá hủy.

#### Action hiện tại và ưu tiên năng lượng

- **Keep Current Ammo** tránh đổi đạn không cần thiết.
- **Target Bridge Room** khả dụng cho thực thể có thể chọn mục tiêu.
- **Set Target Mode** điều khiển cách phòng anti-craft chọn mục tiêu và có lệnh manual tương ứng.
- Mục tiêu theo phòng gốc/phòng hiện tại hỗ trợ logic teleport và di chuyển.
- Research **System Synchronization** đặt ưu tiên action của phòng. Khi reactor bị hỏng, thứ tự này quyết định phòng nào mất năng lượng trước.

Nên đặt các dòng sinh tồn khẩn cấp trước, sau đó tới lựa chọn đạn/target mode, di chuyển/quay về, rồi mới tới action dự phòng chung. Luôn thử AI trong trận vì một dòng có thể không khả dụng hoặc luôn sai với thực thể không có thuộc tính đang kiểm tra.

Nguồn: [V0.999.15](https://blog.pixelstarships.com/2024/12/04/galaxy-patch-notes-v0-999-15/), [V0.999.43](https://blog.pixelstarships.com/2026/01/20/fleet-wars-patch-notes-v0-999-43/), [V0.999.46](https://blog.pixelstarships.com/2026/02/11/galaxy-patch-notes-v0-999-46/) và [V0.999.55](https://blog.pixelstarships.com/2026/06/17/hull-14-major-update-patch-notes-v0-999-55/).
