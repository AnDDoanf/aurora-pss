---
title: "Giới thiệu"
order: 1
level: "beginner"
---

### Giới thiệu

Cơ chế phòng, layout, bảo vệ, buff, layout đã lưu, phòng y tế, phòng tiện ích và sự khác nhau giữa phòng tham chiến/không tham chiến được trình bày chung tại đây.

#### Buff phòng {#buff-phòng}

Phòng có thể được buff \- qua đó hoạt động tốt hơn \- thông qua ba nguồn: giáp, module, và (chỉ số của) crew đứng trong slot phòng.

##### Giáp

* Giáp giảm tổn hại hệ thống lẫn tổn hại thân tàu, từ bất kỳ lực phá hoại nào, bao gôm súng, pháo, laze, tên lửa…, cho phòng mà nó tiếp xúc.  
* Giáp giảm sát thương cho crew đứng trong phòng trước các lực phá hoại bên ngoài  
* Giáp cũng giảm tổn hại đến từ phá hoại của crew địch đổ bộ, hay từ lửa cháy trong phòng  
* Giáp không giảm sát thương mà crew của ban nhận phải từ crew địch trong phòng  
* Giáp không giảm EMP  
* Giáp không giảm thời gian cháy

Giáp sẽ tăng phòng thủ của phòng, theo phần trăm, và số phần trăm tăng lên được thì tính theo chỉ số phòng thủ trong thông tin ở trên.

##### Module

Hiện tại có bốn loại module:

**Module tăng HP**

![Các module tăng HP](/guide-images/vi/gioi-thieu.png)

* Túi cát, gạch, tường bê tông và rào chắn năng lượng thuộc loại này.
* Chúng nhận sát thương trước khi HP của phòng bị ảnh hưởng.
* Chúng không hấp thụ sát thương từ tên lửa xuyên phá hoặc EMP.
* Trong giao tranh, chúng là vật phẩm dùng một lần và crew không thể sửa.
* Bạn có thể sửa chúng sau khi giao tranh kết thúc.

**Module cứu hỏa**

![Các module cứu hỏa](/guide-images/vi/gioi-thieu-2.png)

* Chúng giúp crew dập lửa nhanh hơn và giảm sát thương độc cho crew trong phòng.
* Chúng không tự dập lửa nếu không có crew.
* Chúng không bị phá hủy và không cần sửa.

**Mìn**

![Các module mìn](/guide-images/vi/gioi-thieu-3.png)

* Chúng được kích hoạt khi crew địch đi qua phòng.
* Chúng gây sát thương hoặc đóng băng crew địch, nhưng không còn ảnh hưởng crew phe mình từ V0.999.55.
* Chúng không gây sát thương cho phòng.
* Trong giao tranh, chúng là vật phẩm dùng một lần và crew không thể sửa.
* Bạn có thể sửa hoặc nạp lại chúng sau giao tranh.

Nguồn: [Hull 14 Major Update, V0.999.55](https://blog.pixelstarships.com/2026/06/17/hull-14-major-update-patch-notes-v0-999-55/).

**Đèn hiệu triệu hồi**

![Các module đèn hiệu triệu hồi](/guide-images/vi/gioi-thieu-4.png)

* Chúng lập tức dịch chuyển crew đồng minh về phòng có đặt đèn hiệu nếu crew đang ở xa và nhắm tới phòng đó.
* Mỗi lần kích hoạt có thời gian hồi chiêu 1 giây.
* Khi kích hoạt, chúng đặt lại bộ đếm hành động của crew.
* Tùy cấp độ, chúng có thể được dùng từ 1 đến 3 lần trong một trận.
* Bạn có thể sửa hoặc nạp lại chúng sau giao tranh.

##### Chỉ số của crew

Crew có hai tập chỉ số mà thiên hạ hay gọi là những chỉ số bên trái và những chỉ số bên phải.

Những chỉ số bên trái không buff cho phòng, do đó trong bài viết này chúng ta nói về những chỉ số bên phải, bao gồm:

* Phi công  
* Khiên  
* Động cơ  
* Vũ khí  
* và một chỉ số chết gọi là Nghiên cứu

![PSS guide illustration 3](/guide-images/vi/gioi-thieu-5.png)

Ngoại trừ phòng REA, các phòng tham gia combat có một chỉ số hỗ trợ, thông tin đó nói lên rằng phòng được buff bởi chỉ số nào từ crew. Hãy tia trong hình dưới đây, để thấy rằng Khiên được buff bởi chỉ số K.Học.

![Chỉ số Khoa học buff cho phòng](/guide-images/vi/gioi-thieu-6.png)

Phi công, Khiên và Vũ khí sẽ làm giảm thời gian sạc của phòng, còn Động cơ tăng tỷ lệ né cho phòng ENGINE. Phòng này giúp tàu né được (có tỉ lệ) tất cả những vũ khí dạng đầu đạn (missile) \- nôm na là những phòng mà ném “hòn” gì đó ra, bao gồm:

* Các loại tên lửa từ phòng tên lửa (MSL, MML)  
* Đạn từ máy bay Firehawk và Cosair  
* Roket từ CML  
* Drone từ HDL  
* Bom nguyên tử từ NUC

##### Reinforcement và Auxiliary Booster

Crew có thể **reinforce** phòng, tạm thời tăng HP tối đa theo chỉ số Repair của crew. **Urgent Repair** có thể reinforce tối đa `ABL / 4` HP. Sát thương AP bỏ qua phần HP tối đa được reinforce.

Auxiliary Booster có thể chuyên môn hóa thành:

- **Flight Assist Controller** cho hangar và craft được kết nối.
- **Gunnery Overdrive Core** cho phòng gun và cannon được kết nối.
- **Missile Reload Matrix** cho phòng missile được kết nối.

![Các nhánh Auxiliary Booster](/guide-images/vi/gioi-thieu-7.gif)

Hiệu quả Auxiliary Booster tối đa hiện là **12%**. Mine module không còn gây sát thương hoặc đóng băng crew phe mình. Nguồn: [giới thiệu phòng Level 14](https://blog.pixelstarships.com/2026/05/04/sneak-peek-level-14-rooms-crew-wishlists/), [Hull 14 V0.999.55](https://blog.pixelstarships.com/2026/06/17/hull-14-major-update-patch-notes-v0-999-55/) và [V0.999.57](https://blog.pixelstarships.com/2026/07/06/galaxy-patch-notes-v0-999-57/).

# Các cơ chế căn bản {#các-cơ-chế-căn-bản}

## Phòng và buff phòng {#phòng-và-buff-phòng}

#### Phòng tham gia giao tranh, và phòng không tham gia giao tranh {#phòng-tham-gia-giao-tranh,-và-phòng-không-tham-gia-giao-tranh}

Hiểu biết về phòng là một trong số các nền tảng quan trọng ảnh hưởng đến thiết kế tàu, thiết kế AI, thiết kế chiến thuật.

Trước tiên, bạn cần phân biệt được hai loại phòng: phòng tham gia giao tranh và phòng không tham gia giao tranh, hay phòng có HP và không có HP, hay phòng bắn vào được và phòng không bắn vào được. Lưu ý rằng giáp, thang máy và đường hầm không thuộc về loại nào trong hai loại trên.

Nói phòng không bắn vào được là không chính xác lắm, nhưng cũng gần như thế. Ta không thể cài đặt để AI ngắm bắn các phòng này, cũng như phòng thủ của chúng quá cao để trở thành một mục tiêu đáng bắn vào. Chúng bao gồm tất cả các phòng không có thanh HP mà bạn nhìn thấy, trừ giáp, thang máy và đường hầm.

Lý do mà chúng được gọi là phòng không tham gia giao tranh là vì chúng không đóng bất kỳ vai trò nào trong combat, và không được hưởng bất kỳ lợi ích gì từ chỉ số của crew. Có một ngoại lệ duy nhất là phòng BRD, phòng này và chỉ số Phi công của crew đứng trong nó ảnh hưởng đến tỷ lệ chạy thoát của bạn.

Các phòng bắn vào được, ở phía ngược lại, chúng có thanh máu, chúng có phòng phủ khá thấp và rất cần được bổ trợ bởi giáp, chúng có chức năng cụ thể trong combat, chức năng của chúng được bổ trợ bởi chỉ số của crew, và chúng đều là những mục tiêu khả thi để bem.

![So sánh phòng tham gia và không tham gia giao tranh](/guide-images/vi/gioi-thieu-8.png)

**Ví dụ về phòng tham gia giao tranh (bên trái) và phòng không tham gia giao tranh (bên phải).**

#### Phòng y tế mở rộng {#phòng-y-tế-mở-rộng}

![PSS guide illustration 107](/guide-images/vi/gioi-thieu-9.png)

Toilet (WC, 2×2) – WC

![PSS guide illustration 108](/guide-images/vi/gioi-thieu-10.png)

Flower Gardens(FG, 3×2) – vườn hoa

##### Cơ chế phòng y tế hiện tại

Medbay là phòng thụ động, liên tục hồi máu cho crew. Phòng y tế và kỹ năng hồi máu cũng loại bỏ hiệu ứng trạng thái.

**Revivification Chamber** của Hull 14 là phòng phòng thủ 3×2, có 4 HP. Phòng hồi sinh crew đã chết trong trận tàu hiện tại; tốc độ reload được tăng bởi SCI hoặc kỹ năng Rush.

![Revivification Chamber](/guide-images/vi/gioi-thieu-11.gif)

AI có thể dùng điều kiện **Is Healing** cho phòng y tế. Nguồn: [V0.999](https://blog.pixelstarships.com/2024/05/16/galaxy-patch-notes-v0-999/), [giới thiệu phòng Level 14](https://blog.pixelstarships.com/2026/05/04/sneak-peek-level-14-rooms-crew-wishlists/) và [V0.999.57](https://blog.pixelstarships.com/2026/07/06/galaxy-patch-notes-v0-999-57/).

##### Phòng giá trị cao {#phòng-giá-trị-cao}

Tất cả các phòng có HP đều có khả năng trở thành những mục tiêu ngắm bắn của đối phương. Nhưng luôn luôn có một số phòng là mục tiêu ngắm bắn/phá hủy thường xuyên. Chẳng hạn như phòng SHL, TLP, EMP, AA… Lý do, thiếu chúng, tàu:

* Mất khả năng hoạt động  
* Mất khả năng  phòng thủ  
* Mất sức tấn công  
* Mất khả năng triển khai chiến thuật

Hoặc, chúng:

* Mục tiêu dễ công phá (phòng có 2HP)  
* Nguy hiểm đối với chiến thuật của đối phương (chẳng hạn tàu dùng cloak sẽ tìm cách vô hiệu hóa Radar, tàu phòng thủ yếu sẽ tìm cách vô hiệu hóa Cổng dịch chuyển...)

Những phòng cần ưu tiên phòng thủ / bảo vệ hơn những phòng khác sẽ là:

* Quan trọng với chiến thuật của bạn  
* Nguy hiểm để chống lại những chiến thuật đang trong meta  
* Ít HP

Ưu tiên phòng thủ có thể thông qua:

* Nhiều giáp hơn (chẳng hạn room 2HP bọc 5 giáp, room 3HP bọc 4 giáp)  
* Đặt module bảo vệ xịn hơn (chẳng hạn room không đủ giáp thì bù lại bằng cục module xịn hơn)  
* Đặt gần crew bảo vệ / sửa hơn, chạy đến tốn ít thang máy hơn

Có một số quy tắc khi sắp xếp phòng như sau.

###### Quy tắc 1: phòng phải nối nhau

Hãy nhìn layout dưới đây. Tất cả các phòng chiến đấu ở đó đều được nối với nhau, nhờ đó mà crew có thể di chuyển qua lại. Đây là điều kiện tiên quyết để các crew tank của bạn có thể support khắp tàu. Dù là bạn điều khiển tay hay crew tuân theo AI thì phòng vẫn cần phải có đường đi tới thì mới tới được.

![PSS guide illustration 5](/guide-images/vi/gioi-thieu-12.png)

Ở chiều ngược lại, dưới đây là một ví dụ về phòng không nối nhau. Về lý thuyết thì bố trí này vẫn có ưu điểm, bởi không thể đi tới được các phòng không kết nối nên mỗi crew chỉ phải chịu trách nhiệm hoạt động trên một lượng phòng rất nhỏ. Chúng sẽ phản ứng nhanh, ít phải chạy dài. Bên cạnh đó, phòng không nối nhau cũng khiến cho các crew đổ bộ khó lòng phá banh toàn bộ tàu bạn hơn.

Nhưng đó là về lý thuyết, ở các cup cao, các ưu và nhược điểm vừa kể trên đều chẳng còn mấy ý nghĩa. Súng của tàu địch focus fire rất thông minh và nếu bạn không có khả năng cứu tàu của chính mình thì không còn gì để nói nữa. Crew đổ bộ cũng không dừng ở số lượng một hai, và cũng target rất đa dạng. Vì vậy, lời khuyên là hãy giữ cho tất cả các phòng chiến đấu được kết nối.

![PSS guide illustration 6](/guide-images/vi/gioi-thieu-13.png)

###### Quy tắc 2: phòng giá trị cao tụ về gần nhau

Dù gì đi nữa, bạn cũng sẽ thường xuyên đặt AI quay về phòng chờ cho crew tank. Phòng chờ có thể là các phòng giá trị cao hoặc phòng gần đó.

Vậy nên nếu bạn đặt các phòng giá trị cao ở xa nhau thì tank của bạn sẽ thường xuyên phải chạy những quãng đường rất dài. Chuyện hết thể lực sẽ nhanh chóng xảy ra. Và bạn sẽ nhanh chóng mất khả năng bảo trì trạng thái ổn định để chiến đấu.

Lời khuyên ở đây là tụ các phòng giá trị cao về gần nhau. Không nhất thiết các phòng giá trị cao phải dính sát, liền kề với nhau (xem quy tắc 3), nhưng ít nhất bạn không được đặt các phòng giá trị cao mỗi phòng một góc.

###### Quy tắc 3: rải đều các phòng chờ ở khắp tàu

Phòng chờ ở đây là phòng để quay về chỗ cũ, dành cho các crew tank và các crew thủ đổ bộ, sau khi chúng đã làm xong nhiệm vụ của mình. Chẳng hạn nếu bạn có gunner có khả năng thủ đổ bộ, thì sau khi đi phòng thủ xong chúng ta thường cho gunner đó chạy về lazer gần nhất. Vậy lazer chính là phòng chờ của crew đó.

Tùy bạn định nghĩa phòng chờ là phòng nào, và đặt AI quay về bằng cách nào. Nhưng dù chúng là gì đi nữa thì cũng đều cần được gần, được xen kẽ với các phòng giá trị cao, bao phủ xung quanh các phòng giá trị cao, trở thành phòng vệ tinh của phòng giá trị cao. Nhờ đó khi có sự vụ xảy ra (phòng giá trị cao bị hỏng, bị crew địch đổ bộ…) thì crew đang tại phòng chờ có thể nhanh chóng phản ứng, và khi xong việc thì cũng có thể nhanh chóng trở về, mà không mất quá nhiều thời gian và thể lực.

###### Quy tắc 4: tránh để thang máy giam crew của bạn, nếu có thể

Như sau đây là chết. Thang máy biến thành những cái bẫy giam crew của bạn lại. Sẽ rất tệ nếu phòng giam đó bị tập trung hỏa lực.

![PSS guide illustration 7](/guide-images/vi/gioi-thieu-14.png)Thang giam crew

###### Quy tắc 5: phải có thang bọc hai đầu

Tránh lối xếp thang máy mà chỉ có các thang ở giữa. Các thang đó sẽ biến thành các nút thắt cổ chai rất tệ. Thang như dưới đây đảm bảo luôn có ít nhất hai đường để lên cùng một phòng ở tầng khác. Có thể mới đủ thang mà đi.

![PSS guide illustration 8](/guide-images/vi/gioi-thieu-15.png)

###### Quy tắc 6: cho crew phòng thủ đứng về phía đuôi tàu so với phòng mà nó bảo vệ

Quy tắc này không bảo rằng bạn đặt 2 loại phòng trên ở hai đầu của tàu, mà nói về vị trí tương đối của chúng với nhau. Rằng nếu có hai phòng ở gần nhau thì phòng chờ (phòng chứa crew tank và thủ đổ bộ) nên là phòng nằm ở phía đuôi tàu.

Lý do cho việc này liên quan đến slot phòng (tham khảo [cơ chế của crew combat](http://local.nguyenbinhson.com/co-che/808/crew-combat-101/)). Slot A dành cho crew của bạn sẽ nằm ở phía đuôi tàu của bạn. Còn slot A dành cho crew địch sẽ nằm ở phía đuôi tàu địch, tức là phía đầu tàu của bạn. Nếu bạn thiết kế hợp lý, đường đi của crew sẽ giảm đáng kể, đồng thời crew của bạn cũng sẽ vào vị trí sẵn sàng giao tranh sớm hơn.

![PSS guide illustration 9](/guide-images/vi/gioi-thieu-16.png)

Trong hình trên, crew nữ có thể nhanh chóng thủ phòng TLP, và crew nam có thể nhanh chóng thủ phòng REA, tuy nhiên nếu crew nữ phải thủ phòng REA, cô ta không những phải chạy quãng đường dài hơn, mà còn phải phơi thân cho crew địch bắn một thời gian khá lâu.

Các phòng dưới đây không có sẵn trong kho cung ứng (store) của game mà chỉ được bán bằng bux qua shop hằng ngày; bằng dove qua shop dove; hay bằng quà thưởng khi nạp. Chúng có thể là một phần quan trọng trên tàu, hoặc không, có thể là một phần trong lối chơi, hoặc không. Và chúng ảnh hưởng đến kế hoạch sử dụng bux, dove, và kế hoạch tham gia mùa giải (tour) để lấy dove của bạn.

Lưu ý, danh sách dưới đây không đảm bảo đầy đủ, một số phòng có chức năng tương đương với những phòng được liệt kê ở đây, không còn được bán nữa, hay không có được bán sẽ không được liệt kê.

##### Phòng bed mở rộng {#phòng-bed-mở-rộng}

Có tổng cộng 9 bed phụ, giúp mở rộng 10 crew. Có một bed không bán daily sale, hai bed rất ít khi bán, và các bed còn lại bán thường xuyên hơn, từ 4-6 tháng một lần.

![PSS guide illustration 93](/guide-images/vi/gioi-thieu-17.png)

Dog House (DH, 2×2) – nhà chó, chỉ bán kèm theo gói hỗ trợ muộn($45 trên trang chủ)

![PSS guide illustration 94](/guide-images/vi/gioi-thieu-18.png)

Aquarium (AQU, 2×3) – bể cá, nhà của con mực, phòng bed mở rộng duy nhất có thể up level và chứa được 2 crew. Bán trong shop dove và rất ít khi bán qua daily sale.

![PSS guide illustration 95](/guide-images/vi/gioi-thieu-19.png)

Captain’s Quarters (CAP, 3×2) – phòng riêng của thuyền trưởng

![PSS guide illustration 96](/guide-images/vi/gioi-thieu-20.png)

XMas Tree (XMA, 2×2) – cây Noel

![PSS guide illustration 97](/guide-images/vi/gioi-thieu-21.png)

Graveyard (GRA, 2×2) – mộ

![PSS guide illustration 98](/guide-images/vi/gioi-thieu-22.png)

Cat House (CAT, 2×2) – nhà cho mèo, nhà của Meowy, con linh vật của trang này

![PSS guide illustration 99](/guide-images/vi/gioi-thieu-23.png)Oven (OVE, 2×2) – lò nướng, nhà của gà Turkey

![PSS guide illustration 100](/guide-images/vi/gioi-thieu-24.png)Cryopod / Zakian Cryopod (CP / ZCP, 2×2) – bán qua shop dove và rất ít khi bán qua daily sale

![PSS guide illustration 101](/guide-images/vi/gioi-thieu-25.png)

Car Garage (CAR, 2×2) – nhà để xe

##### Phòng luyện tập mở rộng {#phòng-luyện-tập-mở-rộng}

![PSS guide illustration 103](/guide-images/vi/gioi-thieu-26.png)

Galaxy Gym (GYM, 3×2) – Phòng tập Gym Ngân Hà, tương đương một phòng Gym level 9, nhưng train được cùng lúc 3 crew

![PSS guide illustration 104](/guide-images/vi/gioi-thieu-27.png)

Lunar College (LUN, 2×2) – Học viện Ánh Trăng Tương đương một học viện level 9, có thể train cùng lúc 2 crew

##### Lò phản ứng mở rộng {#lò-phản-ứng-mở-rộng}

![PSS guide illustration 109](/guide-images/vi/gioi-thieu-28.png)

Coal Reactor (CR, 2×2) – Lò phản ứng chạy bằng than, có thể nâng cấp lên level 2, cấp được 2 năng lượng

##### Phòng AI mở rộng {#phòng-ai-mở-rộng}

![PSS guide illustration 110](/guide-images/vi/gioi-thieu-29.png)

Computer Room (COM, 2×2) – Phòng máy tính, cho phép lưu 25 dòng AI, nhiều hơn CMD level 7 nhưng ít hơn CMD level 8, và tiết kiệm được 2 ô diện tích tàu

##### Nhà kho mở rộng {#nhà-kho-mở-rộng}

![PSS guide illustration 111](/guide-images/vi/gioi-thieu-30.png)

Workshop (WOR, 2×2) – Xưởng, sức chứa 150\. Có thể cập nhật tới level 2 để có sức chứa 400

##### Máy khai thác khoáng mở rộng {#máy-khai-thác-khoáng-mở-rộng}

Liệt kê cho đủ chứ mấy phòng dưới đây nói chung là lừa người thôi.

![PSS guide illustration 116](/guide-images/vi/gioi-thieu-31.png)

Prototype Mining Drill (MIN, 2×3)

![PSS guide illustration 117](/guide-images/vi/gioi-thieu-32.png)

Prototype Gas Extractor (GAS, 2×3)

##### Một số skin {#một-số-skin}

Có khá nhiều skin, và số lượng của chúng đang tăng dần theo thời gian, sau mỗi mùa giải, nên mệt quá không kể hết được. Nhưng đại loại thì skin trông như sau:

![PSS guide illustration 118](/guide-images/vi/gioi-thieu-33.png)

Love Quarter Apply – Phòng tình yêu, skin của phòng CAP.

![PSS guide illustration 119](/guide-images/vi/gioi-thieu-34.png)

Velvet Sanctuary (LOV) – Phòng gấm, skin của phòng CAP.

##### Layout đã lưu và giới hạn cấp cao hiện tại

Ship Layout Saving lưu cấu hình phòng, crew, module và AI. Slot được mở bằng research và chỉ áp dụng cho hull/cấp tàu hiện tại.

![Giao diện lưu layout tàu](/guide-images/vi/gioi-thieu-35.png)

Hull 14 thêm ba slot giới hạn crew và nhiều kích thước phòng mới, vì vậy không nên sao chép nguyên layout hull thấp. Các giá trị hiện tại ảnh hưởng trực tiếp đến thiết kế gồm:

- Engine Room có evasion capacity **25**, Ship Thrusters **15**.
- Security Gate có HP/công suất tối đa **2**, Teleport Repulsor **4**.
- Hangar, Defense Hangar và Drone Hangar có HP/công suất tối đa **5**.
- Giới hạn Plasma Discharger và Missile Pod tăng từ 2 lên 3.

Nguồn: [giới thiệu lưu layout](https://blog.pixelstarships.com/2025/06/06/sneak-peek-layout-saving-wargames-more/), [Hull 14 V0.999.55](https://blog.pixelstarships.com/2026/06/17/hull-14-major-update-patch-notes-v0-999-55/) và [V0.999.57](https://blog.pixelstarships.com/2026/07/06/galaxy-patch-notes-v0-999-57/).

##### Hệ thống skin tài khoản hiện tại

Skin là mở khóa vĩnh viễn trên tài khoản, không còn là skin kit nằm trong inventory. Skin phòng, missile, laser, shield và craft được chọn tại bảng thông tin của phòng, đạn hoặc craft tương ứng.

![Mở khóa skin tài khoản](/guide-images/vi/gioi-thieu-36.png)

Nguồn: [hệ thống skin mới](https://blog.pixelstarships.com/2023/08/11/introducing-a-new-skin-system/).

Current references: [V0.999](https://blog.pixelstarships.com/2024/05/16/galaxy-patch-notes-v0-999/), [V0.999.16](https://blog.pixelstarships.com/2024/12/17/ugc-stickers-galaxy-patch-notes-v0-999-16/), [Hull 14 V0.999.55](https://blog.pixelstarships.com/2026/06/17/hull-14-major-update-patch-notes-v0-999-55/), and [V0.999.57](https://blog.pixelstarships.com/2026/07/06/galaxy-patch-notes-v0-999-57/).
