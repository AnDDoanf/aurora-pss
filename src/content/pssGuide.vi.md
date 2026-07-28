# Cẩm nang người chơi PSS

Kafka@2023

Tài liệu này được tập hợp từ những bài viết cũ trên website vietnamstarwalkers.com (hiện đã cho down), viết trong khoảng thời gian năm 2019 \~ 2020\. Một số nội dung có thể đã out-dated, lưu ý khi tham khảo.

# Các cơ chế căn bản {#các-cơ-chế-căn-bản}

## Phòng và buff phòng {#phòng-và-buff-phòng}

### Phòng tham gia giao tranh, và phòng không tham gia giao tranh {#phòng-tham-gia-giao-tranh,-và-phòng-không-tham-gia-giao-tranh}

Hiểu biết về phòng là một trong số các nền tảng quan trọng ảnh hưởng đến thiết kế tàu, thiết kế AI, thiết kế chiến thuật.

Trước tiên, bạn cần phân biệt được hai loại phòng: phòng tham gia giao tranh và phòng không tham gia giao tranh, hay phòng có HP và không có HP, hay phòng bắn vào được và phòng không bắn vào được. Lưu ý rằng giáp, thang máy và đường hầm không thuộc về loại nào trong hai loại trên.

Nói phòng không bắn vào được là không chính xác lắm, nhưng cũng gần như thế. Ta không thể cài đặt để AI ngắm bắn các phòng này, cũng như phòng thủ của chúng quá cao để trở thành một mục tiêu đáng bắn vào. Chúng bao gồm tất cả các phòng không có thanh HP mà bạn nhìn thấy, trừ giáp, thang máy và đường hầm.

Lý do mà chúng được gọi là phòng không tham gia giao tranh là vì chúng không đóng bất kỳ vai trò nào trong combat, và không được hưởng bất kỳ lợi ích gì từ chỉ số của crew. Có một ngoại lệ duy nhất là phòng BRD, phòng này và chỉ số Phi công của crew đứng trong nó ảnh hưởng đến tỷ lệ chạy thoát của bạn.

Các phòng bắn vào được, ở phía ngược lại, chúng có thanh máu, chúng có phòng phủ khá thấp và rất cần được bổ trợ bởi giáp, chúng có chức năng cụ thể trong combat, chức năng của chúng được bổ trợ bởi chỉ số của crew, và chúng đều là những mục tiêu khả thi để bem.

### Buff phòng {#buff-phòng}

Phòng có thể được buff \- qua đó hoạt động tốt hơn \- thông qua ba nguồn: giáp, module, và (chỉ số của) crew đứng trong slot phòng.

#### Giáp

* Giáp giảm tổn hại hệ thống lẫn tổn hại thân tàu, từ bất kỳ lực phá hoại nào, bao gôm súng, pháo, laze, tên lửa…, cho phòng mà nó tiếp xúc.  
* Giáp giảm sát thương cho crew đứng trong phòng trước các lực phá hoại bên ngoài  
* Giáp cũng giảm tổn hại đến từ phá hoại của crew địch đổ bộ, hay từ lửa cháy trong phòng  
* Giáp không giảm sát thương mà crew của ban nhận phải từ crew địch trong phòng  
* Giáp không giảm EMP  
* Giáp không giảm thời gian cháy

Hãy xem thông tin của vài loại giáp:

![PSS guide illustration 1](/guide-images/image1.png)![PSS guide illustration 2](/guide-images/image2.png)

Giáp sẽ tăng phòng thủ của phòng, theo phần trăm, và số phần trăm tăng lên được thì tính theo chỉ số phòng thủ trong thông tin ở trên.

#### Module

Module là thứ mới được bổ sung vào game, và có lẽ sẽ tồn tại lâu. Hiện tại mới có ba loại module:

* Tăng HP:  
  * Túi cát, gạch, tường bê tông, rào chắn năng lượng thuộc loại này  
  * Chúng nhận thay sát thương trước khi HP của phòng bị ảnh hưởng  
  * Chúng không nhận thay sát thương gây ra bởi tên lửa xuyên phá hay hứng thay EMP  
  * Trong combat, chúng là đồ dùng một lần, hỏng là hết, crew không sửa được  
  * Bạn có thể sửa chúng sau khi kết thúc giao tranh  
* Cứu hỏa  
  * Chúng hỗ trợ crew dập lửa nhanh hơn  
  * Chúng không tự dập lửa nếu không có crew  
  * Chúng không bị phá hủy và không cần sửa  
* Mìn  
  * Chúng được kích hoạt khi crew địch đi qua  
  * Chúng gây sát thương lên mọi crew trong phòng, kể cả crew phe mình  
  * Chúng không phá hoại lên phòng  
  * Chúng là đồ dùng một lần trong combat và crew không sửa được  
  * Bạn có thể sửa chúng sau combat

#### Chỉ số của crew

Crew có hai tập chỉ số mà thiên hạ hay gọi là những chỉ số bên trái và những chỉ số bên phải.

Những chỉ số bên trái không buff cho phòng, do đó trong bài viết này chúng ta nói về những chỉ số bên phải, bao gồm:

* Phi công  
* Khiên  
* Động cơ  
* Vũ khí  
* và một chỉ số chết gọi là Nghiên cứu

![PSS guide illustration 3](/guide-images/image3.png)

Ngoại trừ phòng REA, các phòng tham gia combat có một chỉ số hỗ trợ, thông tin đó nói lên rằng phòng được buff bởi chỉ số nào từ crew. Hãy tia trong hình dưới đây, để thấy rằng Khiên được buff bởi chỉ số K.Học.

![PSS guide illustration 4](/guide-images/image4.png)

Phi công, Khiên và Vũ khí sẽ làm giảm thời gian sạc của phòng, còn Động cơ tăng tỷ lệ né cho phòng ENGINE. Phòng này giúp tàu né được (có tỉ lệ) tất cả những vũ khí dạng đầu đạn (missile) \- nôm na là những phòng mà ném “hòn” gì đó ra, bao gồm:

* Các loại tên lửa từ phòng tên lửa (MSL, MML)  
* Đạn từ máy bay Firehawk và Cosair  
* Roket từ CML  
* Drone từ HDL  
* Bom nguyên tử từ NUC

### Phòng giá trị cao {#phòng-giá-trị-cao}

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

#### Quy tắc 1: phòng phải nối nhau

Hãy nhìn layout dưới đây. Tất cả các phòng chiến đấu ở đó đều được nối với nhau, nhờ đó mà crew có thể di chuyển qua lại. Đây là điều kiện tiên quyết để các crew tank của bạn có thể support khắp tàu. Dù là bạn điều khiển tay hay crew tuân theo AI thì phòng vẫn cần phải có đường đi tới thì mới tới được.

![PSS guide illustration 5](/guide-images/image5.png)

Ở chiều ngược lại, dưới đây là một ví dụ về phòng không nối nhau. Về lý thuyết thì bố trí này vẫn có ưu điểm, bởi không thể đi tới được các phòng không kết nối nên mỗi crew chỉ phải chịu trách nhiệm hoạt động trên một lượng phòng rất nhỏ. Chúng sẽ phản ứng nhanh, ít phải chạy dài. Bên cạnh đó, phòng không nối nhau cũng khiến cho các crew đổ bộ khó lòng phá banh toàn bộ tàu bạn hơn.

Nhưng đó là về lý thuyết, ở các cup cao, các ưu và nhược điểm vừa kể trên đều chẳng còn mấy ý nghĩa. Súng của tàu địch focus fire rất thông minh và nếu bạn không có khả năng cứu tàu của chính mình thì không còn gì để nói nữa. Crew đổ bộ cũng không dừng ở số lượng một hai, và cũng target rất đa dạng. Vì vậy, lời khuyên là hãy giữ cho tất cả các phòng chiến đấu được kết nối.

![PSS guide illustration 6](/guide-images/image6.png)

#### Quy tắc 2: phòng giá trị cao tụ về gần nhau

Dù gì đi nữa, bạn cũng sẽ thường xuyên đặt AI quay về phòng chờ cho crew tank. Phòng chờ có thể là các phòng giá trị cao hoặc phòng gần đó.

Vậy nên nếu bạn đặt các phòng giá trị cao ở xa nhau thì tank của bạn sẽ thường xuyên phải chạy những quãng đường rất dài. Chuyện hết thể lực sẽ nhanh chóng xảy ra. Và bạn sẽ nhanh chóng mất khả năng bảo trì trạng thái ổn định để chiến đấu.

Lời khuyên ở đây là tụ các phòng giá trị cao về gần nhau. Không nhất thiết các phòng giá trị cao phải dính sát, liền kề với nhau (xem quy tắc 3), nhưng ít nhất bạn không được đặt các phòng giá trị cao mỗi phòng một góc.

#### Quy tắc 3: rải đều các phòng chờ ở khắp tàu

Phòng chờ ở đây là phòng để quay về chỗ cũ, dành cho các crew tank và các crew thủ đổ bộ, sau khi chúng đã làm xong nhiệm vụ của mình. Chẳng hạn nếu bạn có gunner có khả năng thủ đổ bộ, thì sau khi đi phòng thủ xong chúng ta thường cho gunner đó chạy về lazer gần nhất. Vậy lazer chính là phòng chờ của crew đó.

Tùy bạn định nghĩa phòng chờ là phòng nào, và đặt AI quay về bằng cách nào. Nhưng dù chúng là gì đi nữa thì cũng đều cần được gần, được xen kẽ với các phòng giá trị cao, bao phủ xung quanh các phòng giá trị cao, trở thành phòng vệ tinh của phòng giá trị cao. Nhờ đó khi có sự vụ xảy ra (phòng giá trị cao bị hỏng, bị crew địch đổ bộ…) thì crew đang tại phòng chờ có thể nhanh chóng phản ứng, và khi xong việc thì cũng có thể nhanh chóng trở về, mà không mất quá nhiều thời gian và thể lực.

#### Quy tắc 4: tránh để thang máy giam crew của bạn, nếu có thể

Như sau đây là chết. Thang máy biến thành những cái bẫy giam crew của bạn lại. Sẽ rất tệ nếu phòng giam đó bị tập trung hỏa lực.

![PSS guide illustration 7](/guide-images/image7.png)Thang giam crew

#### Quy tắc 5: phải có thang bọc hai đầu

Tránh lối xếp thang máy mà chỉ có các thang ở giữa. Các thang đó sẽ biến thành các nút thắt cổ chai rất tệ. Thang như dưới đây đảm bảo luôn có ít nhất hai đường để lên cùng một phòng ở tầng khác. Có thể mới đủ thang mà đi.

![PSS guide illustration 8](/guide-images/image8.png)

#### Quy tắc 6: cho crew phòng thủ đứng về phía đuôi tàu so với phòng mà nó bảo vệ

Quy tắc này không bảo rằng bạn đặt 2 loại phòng trên ở hai đầu của tàu, mà nói về vị trí tương đối của chúng với nhau. Rằng nếu có hai phòng ở gần nhau thì phòng chờ (phòng chứa crew tank và thủ đổ bộ) nên là phòng nằm ở phía đuôi tàu.

Lý do cho việc này liên quan đến slot phòng (tham khảo [cơ chế của crew combat](http://local.nguyenbinhson.com/co-che/808/crew-combat-101/)). Slot A dành cho crew của bạn sẽ nằm ở phía đuôi tàu của bạn. Còn slot A dành cho crew địch sẽ nằm ở phía đuôi tàu địch, tức là phía đầu tàu của bạn. Nếu bạn thiết kế hợp lý, đường đi của crew sẽ giảm đáng kể, đồng thời crew của bạn cũng sẽ vào vị trí sẵn sàng giao tranh sớm hơn.

![PSS guide illustration 9](/guide-images/image9.png)

Trong hình trên, crew nữ có thể nhanh chóng thủ phòng TLP, và crew nam có thể nhanh chóng thủ phòng REA, tuy nhiên nếu crew nữ phải thủ phòng REA, cô ta không những phải chạy quãng đường dài hơn, mà còn phải phơi thân cho crew địch bắn một thời gian khá lâu.

## Crew và các vai trò của crew {#crew-và-các-vai-trò-của-crew}

Crew và chiến thuật (AI) quan trọng như nhau. Bạn cần cả hai để thắng combat.

Giống như bất kỳ trò chơi chiến thuật nào khác, trả lời cho câu hỏi crew nào là mạnh nhất? sẽ cho câu hỏi là làm gì có thứ như thế\!. Phần lớn starwalker không ai tìm ra được một bộ crew chắc chắn là mạnh nhất nào cả.

Tuy vậy, có những crew thực sự hữu dụng hơn những crew khác. Và bạn cần nhận ra tập các crew chấp nhận được này. Và đó là mục đích của bài viết này.

Trước tiên, bạn hãy biết rằng crew có 7 cấp độ:

1. Thông thường, một sao, màu xám  
2. Tinh anh, hai sao, màu trắng  
3. Độc nhất, ba sao, màu blue  
4. Sử thi, bốn sao, màu tím  
5. Anh hùng, năm sao, màu cam  
6. Đặc biệt, một khiên, màu vàng sáng  
7. Huyền thoại, một cánh, màu vàng đậm

Cấp từ 1-5 sao có thể nhận được từ cửa hàng, trong đó khoáng có thể mua được crew từ 1-3 sao, và giá sẽ tăng 50% với mỗi crew bạn đã có:

![PSS guide illustration 10](/guide-images/image10.png)

Bux có thể mua được crew 3-5 sao, và giá sẽ tăng 10% với mỗi crew 4-5 sao bạn đã có:

![PSS guide illustration 11](/guide-images/image11.png)

Bởi yếu tố giá tăng, bạn nên bỏ đi các crew 1-2 sao.

Các crew cấp 6 không thể hợp thành được mà chỉ có thể nhận qua nạp tiền hoặc thắng event.

Các crew cấp 7 chỉ có thể nhận được qua hợp thành.

Bạn cũng có thể nhận được crew thông qua mua từ tàu tiếp tế hằng ngày, hay qua bán kèm từ shop. Nếu không chắc chắn về sự hữu dụng của crew, hãy hỏi cộng đồng.

Không nên bỏ đi các crew từ 3 sao trở lên trừ khi bạn rất hiểu rằng mình đang làm gì.

### Các chỉ số {#các-chỉ-số}

#### Chỉ số lõi

![PSS guide illustration 12](/guide-images/image12.png)

* HP: lượng hp của crew  
* Tấn công: lượng sát thương có thể gây lên crew địch, mỗi giây, khi crew đứng tại chỗ  
* Sửa chữa: lượng hp phòng mà crew có thể phục hồi được, mỗi giây, khi crew đứng tại chỗ trong phòng  
* Kỹ năng: ảnh hưởng đến hiệu quả của kỹ năng mà crew có

#### Chỉ số buff phòng

![PSS guide illustration 13](/guide-images/image13.png)

Bạn có thể xem bài viết về [Phòng và Buff phòng](http://27.73.126.49/ship/phong-va-buff-phong/), nhưng sơ lược thì:

* Chỉ số Vũ khí giúp tăng tốc độ bắn cho phòng laser, tên lửa, phòng không, và pháo  
* Chỉ số Khoa học giảm thời gian chờ cho phòng khiên, teleport, cloak, radar, các phòng công nghệ photon  
* Chỉ số Phi công giảm thời gian chờ cho phòng máy bay, và tăng tỉ lệ chạy thoát cho phòng thuyền trưởng  
* Chỉ sỗ Kỹ sư cho phòng robot, và phòng động cơ khi tính tỉ lệ né tên lửa

#### Chỉ số phụ trợ

![PSS guide illustration 14](/guide-images/image14.png)![PSS guide illustration 15](/guide-images/image15.png)![PSS guide illustration 16](/guide-images/image16.png)

* Thể lực: mỗi điểm thể lực giúp crew chạy được trong vòng 1 giây  
* Tốc độ đi bộ/chạy: như tên gọi  
* Kháng lửa: giảm sát thương mà crew nhận được từ lửa cháy, theo phần trăm. Nếu kháng lửa của một crew quá 100% thì lửa sẽ làm hồi máu cho crew đó. Chúng ta thường dùng item để làm được điều này.  
* Điểm đào tạo: con số thể hiện số lượng luyện tập thông qua gym hay thuốc tăng lực mà crew còn có thể chịu đựng được.  
* Bộ sưu tập: bộ sưu tập cung cấp một khả năng thụ động (không kích hoạt chủ động được) cho crew khi mà bạn có đủ số lượng crew của bộ sưu tập đó trong đội hình combat.  
* Trang bị: crew có thể trang bị một item cho mỗi slot trang bị mà nó có. Một vài crew không có slot nào. Captaint là crew duy nhất có 6 slot trang bị.

### Kỹ năng của crew {#kỹ-năng-của-crew}

Mỗi crew từ ba sao trở lên có một kỹ năng đặc biệt mà chúng có thể sử dụng khi đạt đến lvl 10\. Mỗi crew có thể sử dụng kỹ năng một lần trong mỗi trận combat.

Có tổng cộng 11 loại kỹ năng:

1. Tử quyền: gây sát thương lên một crew địch trong phòng  
2. Khí độc: gây sát thương lên tất cả các crew địch trong phòng  
3. Hồi phục: tự hồi HP  
4. Chữa thương: hồi HP cho tất cả đồng đội trong phòng  
5. Hàn Xung kích: không phải hàn trong hàn xì, mà là băng hàn. Đóng băng một crew địch trong một khoảng thời gian  
6. Hỏa bước: đi đến đâu gây cháy lên phòng ở đó, luôn kích hoạt  
7. Hack: EMP phòng hiện tại trong một khoảng thời gian  
8. Thiêu đốt: gây cháy lên phòng hiện tại  
9. Phá hủy: gây sát thương hệ thống lên phòng hiện tại  
10. Sửa chữa khẩn cấp: sửa nhanh  
11. Thúc giục: giảm thời gian nạp của phòng hiện tại

Các kỹ năng 1-6 có thể dùng ở bất kỳ đâu, 7-9 chỉ có thể dùng ở tàu địch, và 10-11 chỉ có thể dùng ở tàu bạn.

Chiến thuật sử dụng các kỹ năng sẽ được viết ở một bài viết khác, bài viết này chỉ giải thích ý nghĩa.

### Các vai trò {#các-vai-trò}

Tùy vào chiến thuật của tàu mà sẽ có các role khác nhau cho crew của bạn. Nhìn chung, có khoảng 8 vai trò khác nhau trong meta hiện tại:

* Đứng súng: sử dụng chỉ số vũ khí  
* Khoa học: sử dụng chỉ số khoa học  
* Kỹ sư: sử dụng chỉ số kỹ sư  
* Phi công: sử dụng chỉ số phi công  
* Sửa chữa: sử dụng khả năng sống dai, chạy khỏe, kỹ năng sửa chữa nhanh  
* Thúc giục: sủ dụng kỹ năng thúc giục  
* Đổ bộ: sử dụng chỉ số tấn công, kỹ năng tất sát, kỹ năng phá hủy, đóng băng, gây cháy, hỏa bước, sống dai cũng là một lợi thế  
* Chống đổ bộ: sử dụng chỉ số tấn công, kỹ năng tất sát, đóng băng, sống dai là một lợi thế

Và các crew được xếp hạng về độ thích hợp cho mỗi vai trò. Nguồn tham khảo tốt nhất về rank của mỗi crew cho mỗi vai trò là [Pixel Perfect Guide – Crew Card](https://pixelperfectguide.com/crew/cards/). Bạn có thể vào đấy để tham khảo chi tiết từng crew một, nhưng tựu trung có 5 mức rank:

* Best: crew xứng đáng chơi đến endgame trong vai trò này  
* Good: crew có thể đảm nhiệm vai trò này, bạn có thể dùng được, nhưng ở đường dài hãy nghĩ đến việc pres crew  
* Average: crew miễn cưỡng đáp ứng được vai trò. Phần lớn các crew bạn có ở đầu game là ở mức rank này. Bạn hãy nghĩ đến việc thay thế dần chúng bằng các crew ở rank cao hơn.  
* Poor: không dùng được.

Một vài người chơi cho tất cả các crew làm những việc giống nhau, điển hình là tất cả đều đi sửa, sửa cho đến khi hết con cuối cùng, như thế là không khai thác hiệu quả khả năng của crew. Chúng ta nên phân chia vai trò nhiệm vụ cho các crew.

Một số crew có thể dùng được ở nhiều vai trò, nhưng thường cuối cùng bạn sẽ chọn cho nó một và chỉ một role để tập trung vào, đây là mục tiêu theo đuổi của môn khoa học về [luyện tập và trang bị](https://pixelperfectguide.com/crew/training-items/), nhằm giúp crew đảm nhiệm vai trò của tốt tốt hết sức có thể.

Để biết có thể sử dụng một crew vào việc gì, hãy nhìn vào thông tin của nó:

![PSS guide illustration 17](/guide-images/image17.png)![PSS guide illustration 18](/guide-images/image18.png)

Y tá nam thích hợp để làm một crew sửa chữa, nó có chỉ số sửa chữa không tệ, máu không quá thấp và khi kết hợp với kỹ năng sẽ cho khả năng sống lâu.

Đô đốc Serena là một crew đứng súng tiềm năng với chỉ số Vũ khí cao ngất ngưởng, và kỹ năng Tử quyền trao thêm cho crew này khả năng diệt crew địch đổ bộ.

#### Bao nhiêu crew cho mỗi role

Khó nói. Nhưng cách nghĩ chung là hợp lý, cân bằng, để khiến cho chiến thuật của tàu phát huy hiệu quả. Nếu bạn thường xuyên thua bởi bắn không kịp chứ không phải bởi phòng thủ sửa chữa yếu, vậy hãy tăng khả năng bắn của tàu bạn, bằng cách đổi crew đứng súng tốt hơn, hoặc tăng súng và giảm phòng thủ.

* Trung bình, tỷ lệ crew sửa chữa nên giao động quanh 1/5 số lượng crew của bạn.  
* Lượng crew đổ bộ ít nhất là 3, ít hơn thì không đáng để đặt phòng tele vào tàu bạn (khi bạn có droid đổ bộ, từ lvl 8 thì số lượng crew đổ bộ có thể về 0, tùy chiến thuật của bạn). Số lượng tối đa crew đổ bộ bị giới hạn bởi khả năng teleport của bạn, nếu bạn không có crew rush, thường trong một trận combat bạn sẽ không có khả năng teleport quá 5 crew (do phòng tele bị diệt, bị EMP, do chờ lâu quá crew tele bị bèm hết, hay do hết giờ). Nếu bạn có rush thì có thể sắp xếp nhiều hơn.  
* Số lượng crew đứng shield bằng với số lượng crew mà các phòng shield của bạn chứa được. Từ 2-3, cho đến khi bạn có phòng shield battery thì lên 4-5.  
* Khoa học gia cũng có thể buff các phòng sử dụng công nghệ Photon để chúng phá khiên địch nhanh hơn, phòng teleport để crew của bạn đổ bộ nhanh hơn.  
* Số lượng crew còn lại cho đứng súng. Chúng là những crew quan trọng nhất để gây sát thương lên tàu địch. Thậm chí, trong chiến thuật tấn công cực đoan, các crew đứng khiên còn được bỏ đi để có nhiều crew đứng súng hơn.  
* Trong chiến thuật thiên về tấn công, bạn sẽ cần nhiều crew phụ trách thêm vai trò thúc giục, để giúp bạn đổ bộ càng nhanh càng tốt vào đầu combat.  
* Trong chiến thuật thiên về phòng thủ, bạn sẽ cần nhiều crew có khả năng hồi máu và chữa thương để giúp crew sống lâu hơn  
* Nếu bạn gặp vấn đề với những tàu địch chuyên đổ bộ, vậy hãy bổ sung thêm các crew có thêm vai trò phụ là chống đổ bộ. Serena ở trên là một ví dụ điển hình. Tránh sử dụng các crew chỉ có tác dụng chống đổ bộ mà không có bất kỳ buff phòng nào, bởi chúng sẽ vô dụng khi bạn combat với những tàu không chơi đổ bộ.  
* Danh sách các kỹ năng của crew ở trên được sắp xếp theo thứ tự về tầm quan trọng. Vậy nên các vai trò đứng cuối danh sách nên là vai trò phụ của crew thay vì là vai trò chính.

Mỗi vai trò có một kỹ năng liên quan đề xuất. Tuy vậy, các crew có vai trò phụ thì kỹ năng của chúng nên là kỹ năng liên quan của vai trò phụ. Danh sách kỹ năng liên quan như sau:

* Đứng súng, khoa học, động cơ: nên có kỹ năng hồi máu hay chữa thương. Crew đứng súng có thể có thêm vai trò thúc giục, phòng thủ, hay sửa chữa.  
* Phi công: nên có kỹ năng thúc giục, chữa thương, hồi máu. Có thể đóng thêm vai trò sửa chữa, chống đổ bộ.  
* Sửa chữa: nên có kỹ năng hồi máu, chữa thương, sửa chữa tức thời. Có thể đóng thêm vai trò thúc giục, chống đổ bộ.  
* Thúc giục: bắt buộc phải có kỹ năng thúc giục  
* Đổ bộ: nên có kỹ năng khí độc, tử quyền, hack, phá hủy, đóng băng, gây cháy, hỏa bước, hồi máu. Trước khi đổ bộ, các crew đổ bộ có thể đóng bất kỳ vai trò nào khác phù hợp với chỉ số của chúng.  
* Chống đổ bộ: tốt nhất nên có đóng băng, tử quyền, khí độc, hồi máu. Crew chống đổ bộ KHÔNG có vai trò phụ, nói đúng hơn, chống đổ bộ LÀ một vai trò phụ, bạn nên có thật nhiều crew có thể đóng được vai trò phụ này, bên cạnh vai trò chính của chúng.

### Chỉ số “thâm niên” {#chỉ-số-“thâm-niên”}

Chương này đã specs, không còn đúng nữa.

Mặc dù không có bằng chứng lộ liễu, nhưng có vẻ như game đặt cho mỗi crew một chỉ số thâm niên mỗi khi bắt đầu combat. Chỉ số này ảnh hưởng tới việc crew nào sẽ là con chạy đi sửa phòng trước tiên nếu cả hai crew đều có điều kiện AI thỏa mãn; cũng như ảnh hưởng đến slot mà crew sẽ đứng ở trong phòng; crew có thâm niên cao nhất sẽ đến sửa phòng trước, và đứng về phía bên trái nhất.

Crew thuyền trưởng luôn có thâm niên cao nhất.

Chúng ta không thể thay đổi chỉ số thâm niên, nhưng chúng ta có thể phát hiện và lợi dụng. Việc này được mô tả kỹ hơn trong bài viết về AI sửa tàu.

## Cơ chế hoạt động của đổ bộ và giao tranh chống đổ bộ {#cơ-chế-hoạt-động-của-đổ-bộ-và-giao-tranh-chống-đổ-bộ}

Đổ bộ nói đến việc crew của tàu chúng ta thông qua cửa dịch chuyển đặt trong phòng TLP để dịch chuyển vào một phòng chỉ định trên tàu địch, kích hoạt khả năng tấn công phòng và crew của tàu địch. Thông qua đó làm trục trặc khả năng hoạt động của tàu địch, làm giảm áp lực mà tàu địch gây lên tàu của bạn và tạo điều kiện để các vũ khí trên tàu của bạn tạo ra sát thương lên thân tàu nhằm dẫn tới chiến thắng.

Đổ bộ có thể coi là một trong những chiến thuật nguy hiểm nhất trong PSS. Vậy nên có kể hoạch chống đổ bộ cũng là một phần việc mà bạn phải để tâm đến. Bài viết này làm rõ các cơ chế của trò chơi xoay quanh đổ bộ và combat chống đổ bộ, nhằm làm tiền đề trước khi đi vào AI đổ bộ và chống đổ bộ.

### Cơ chế combat của crew {#cơ-chế-combat-của-crew}

#### Slot phòng

Chúng ta biết là mỗi phòng có một số lượng giới hạn crew có thể đứng buff. Chúng ta gọi mỗi vị trí đứng là một slot, và số lượng crew có thể đứng buff là số slot. Trong bài viết này chúng ta đặt tên là A, B, C… theo thứ tự về thâm niên.

![PSS guide illustration 19](/guide-images/image19.png)A, B, C

Mỗi phòng có hai bộ slot A/B/C cho mỗi phe. Tức là một phòng 2×3 có thể chứa được 6 crew – bao gồm 3 phe mình và 3 phe địch. Bộ A, B, C dành cho crew của bạn thì xếp theo thứ tự từ trái sang phải, còn bộ dành cho crew phe địch thì từ phải sang trái nghĩa là C’, B’, A’. Điều này giúp tạo nên quang cảnh hai crew đứng ở hai phía và chíu chíu nhau như bạn thường thấy khi pvp.

![PSS guide illustration 20](/guide-images/image20.png)A và A’

Slot của các crew trong phòng được xếp đặt theo [thâm niên](http://local.nguyenbinhson.com/crew/seniority-101/) của crew. Nghĩa là giả sử phòng đã có slot A và B có hai crew trẻ đứng. Nếu một crew già bước vào thì hai crew trẻ sẽ dịch bước sang slot B và C, nhường slot A cho crew già. Tương tự như vậy, khi crew già không còn ở trong phòng nữa thì hai crew trẻ sẽ di chuyển để nhận lại slot A và B.

#### Vào vị trí

Crew cần phải đứng vào slot thì mới có thể tham gia combat tay đôi – bao gồm cả tấn công lẫn làm mục tiêu tấn công. Điều này có nghĩa là crew không thể vừa đi vừa bắn được. Và crew đang di chuyển ngang qua phòng cũng sẽ không thể bị crew địch đang đứng trong phòng ngắm làm mục tiêu.

Crew nào tự đi vào phòng (không phải bằng TLP mà vào được phòng) sẽ phải đi tiếp cho đến khi tới được slot. Crew dịch chuyển tức thời vào phòng trong phòng thì ngay lập tức đến được slot, nhưng bù lại sẽ phải chịu 0.5s đứng hình. Crew nào vốn đã đứng sẵn ở slot từ trước thì tất nhiên có thể ngay lập tức bắt đầu combat.

#### Khóa mục tiêu và combat

Phải khóa được mục tiêu thì mới tấn công được. Khi combat tay đôi, mục tiêu được chọn để các bên tấn công trước sẽ luôn là crew tại A và A’. Hễ crew tại A chết đi thì crew tại B sẽ bước tới đảm nhiệm slot đó và trở thành mục tiêu mới.

Không nhất thiết crew phải đứng tại slot thì mới bắt đầu bị ngắm bắn, trên thực tế chúng bắt đầu có khả năng bị ngắm bắn từ khi chúng có ý định đứng vào slot A.

Vậy là crew đang chạy công chuyện ngang qua phòng có crew địch thì sẽ không thể bị crew địch ngắm bắn. Tuy vậy, nếu crew có ý định chạy vào chính phòng có crew địch (phòng mục tiêu có crew địch) thì ngay khi hai con crew giáp mặt nhau, chúng sẽ bắt đầu target nhau. Tất nhiên con mới chạy vào phòng sẽ thiệt thòi một chút bởi nó phải chạy tới slot của mình thì mới bắt đầu bắn được.

Như trên đã nói, các crew không bị khóa mục tiêu thì sẽ không bị tấn công. Nhưng chúng có thể bị ảnh hưởng bởi các skill đến từ combat trong phòng, chẳng hạn hồi máu, khí độc, sóng băng…

Các crew sẽ tấn công, một giây một lần, vào crew bị khóa. Điều này có nghĩa là một crew có thể bị đánh hội đồng, nhưng lại thì lúc nào cũng chỉ bèm duy nhất vào crew đang khóa. Lượng sát thương gây ra khi đánh tay đôi sẽ bằng với chỉ số tấn công của crew.

### Cơ chế sử dụng kỹ năng {#cơ-chế-sử-dụng-kỹ-năng}

Cơ chế sử dụng kỹ năng không phải là một phần của cơ chế đấu tay đôi. Có nghĩa là là việc sử dụng kỹ năng bị giới hạn bởi những ràng buộc khác với những ràng buộc của một trận combat tay đôi. Cụ thể như sau.

#### Điều kiện kích hoạt kỹ năng

Crew từ level 10 trở lên có thể sử dụng một lần kỹ năng cho mỗi battle. Các kỹ năng luôn mặc định ở trạng thái bất hoạt để chúng không dễ dàng bị kích hoạt một cách lãng phí (trừ kĩ năng Hỏa bước), chẳng hạn bởi cài đặt Không: sử dụng kỹ năng. Điều kiện để có thể kích hoạt kỹ năng được mô tả như sau:

* Rush: Phòng mục tiêu là phòng phe mình. Crew đã ở trong phòng mục tiêu. Phòng mục tiêu có khả năng nạp.  
* Sửa chữa khẩn cấp: Phòng mục tiêu là phòng phe mình. Crew đã ở trong phòng mục tiêu. Phòng mục tiêu có hư hại.  
* Khí độc: Crew đã ở trong phòng mục tiêu. Phòng mục tiêu có crew địch.  
* Tử quyền: Crew đã ở trong phòng mục tiêu. Phòng mục tiêu có crew địch.  
* Hack: Phòng mục tiêu là phòng phe địch. Crew đã ở trong phòng mục tiêu. Phòng mục tiêu có khả năng tiêu thụ năng lượng, nhưng không nhất thiết phải đang tiêu thụ năng lượng.  
* Phá hủy: Phòng mục tiêu là phòng phe địch. Crew đã ở trong phòng mục tiêu.  
* Chữa vết thương: crew bị thương tổn  
* Hồi máu: bản thân crew bị thương tổn  
* Phóng hỏa: Phòng mục tiêu là phòng phe địch. Crew đã ở trong phòng mục tiêu, phòng mục tiêu chưa bị phá hủy hoặc chưa bị ảnh hưởng bởi lửa từ các nguồn khác.  
* Hỏa bước: luôn kích hoạt  
* Hàn băng: Crew đã ở trong phòng mục tiêu. Phòng mục tiêu có crew địch.

#### Sử dụng kỹ năng khi combat

Crew không cần phải đợi đến khi bước vào slot trong phòng mới có thể sử dụng kỹ năng. Thay vào đó nó có thể sử dụng kỹ năng ngay lập tức sau khi bước vào phòng mục tiêu. Hơn thế nữa, hành động sử dụng kỹ năng cũng được ưu tiên thực hiện trước hành động combat. Nếu một crew có kỹ năng khí độc bước vào một phòng mục tiêu ngập crew địch, nó sẽ được quyền sử dụng kỹ năng trước khi có bất kỳ hành động đáp trả theo lối combat tay đôi nào xảy ra, và rất có thể nó sẽ dọn sạch crew của phòng đó bằng kỹ năng của mình.

Crew cũng không cần đợi crew đối phương phải target cùng một phòng với mình thì mới có thể sử dụng kỹ năng. TLP là một nơi đầy những crew đang target một phòng khác và sẽ hoàn toàn không vấn đề gì nếu một crew mang bom ga vào thả nổ ở đó. Hoặc một gunner mang tử quyền sẽ ngay lập tức xử đẹp một crew đổ bộ, cho dù crew kia đang thực ra đang target một phòng mục tiêu khác và chỉ vô tình chạy ngang qua.

Bởi cơ chế “ngay lập tức” ở trên, sẽ rất nguy hiểm cho crew đổ bộ nếu nó dịch chuyển vào một phòng có crew có kỹ năng phòng thủ. Bởi 0.5s đứng hình là đủ để crew phòng thủ kết thúc tất cả mọi chuyện.

Tử quyền, khí độc có thể ngắm và bèm chết những crew chạy ngang qua phòng, không cần biết crew đó có có ý định target vào phòng hay không. Nhưng hàn bộc thì khác, crew chạy ngang qua phòng vẫn sẽ bị dính đóng băng, nhưng crew phát skill cũng không thể khóa crew bị đóng băng để bắn cho chết nó được (đọc mục về khóa mục tiêu), không khóa được thì không bắn được, và tới hết thời gian đóng băng thì crew bị đóng băng sẽ chạy đi tiếp tục công việc của nó.

#### Tập kích

Xét trường hợp hai crew ở hai phe đối lập mang kỹ năng cùng thỏa mãn điều kiện sử dụng kỹ năng (xem mục trước), crew bước từ ngoài phòng bước vào sẽ được sử dụng kỹ năng trước crew đứng sẵn ở trong phòng.

#### Ưu tiên

Nếu nhiều crew của cùng một phe ở trong một phòng cùng thỏa mãn điều kiện sử dụng kỹ năng, các crew đó sẽ căn cứ theo thâm niên để xác định crew được dụng kỹ năng trước.

### Cơ chế của phòng TLP {#cơ-chế-của-phòng-tlp}

![PSS guide illustration 21](/guide-images/image21.png)

Phòng Teleport (TLP) là một phòng 2×3, nó có ba slot để crew mỗi bên có thể đứng. Trong phòng TLP có một cổng dịch chuyển, đây cũng là một vị trí mà crew có thể đứng vào được, một khi crew đã bước vào cổng dịch chuyển và cổng đã được nạp đầy năng lượng cũng như không bị EMP, thì crew sẽ được dịch chuyển sang phòng mục tiêu ở phía tàu địch.

Tất cả các crew sau khi được khớp lệnh target phòng mục tiêu ở tàu địch thì đều sẽ tiến về phía phòng TLP, cụ thể hơn là về phía cổng dịch chuyển trong phòng đó. Crew đầu tiên đến được cổng sẽ đứng vào cổng và các crew khác sẽ xếp hàng chờ. Nhưng điều đặc biệt ở đây là chúng không đứng vào bất kỳ slot phòng nào trong phòng dịch chuyển, do phòng target của chúng không phải là phòng dịch chuyển.

Do không đứng vào slot phòng, các crew đang xếp hàng chờ ở cổng dịch chuyển sẽ không tham gia combat tay đôi. Chúng không bắn nhau với crew địch, và cũng không bị crew địch ngắm bắn. Chúng cũng không target phòng TLP đang đứng nên cũng sẽ không sử dụng kỹ năng tấn công tại phòng TLP đang đứng. Tuy vậy chúng vẫn sẽ nhận sát thương crew do súng của tàu địch dội lên phòng TLP, hay do kỹ năng đến từ combat xảy ra giữa hai phe trong phòng.

Tàng hình sẽ khiến cổng dịch chuyển của đối phương không thể định vị và đổ bộ crew được.

Và cuối cùng, crew đổ bộ khi trở về tàu cũ sẽ trở về chính cổng dịch chuyển rồi sau đó mới từ đó di chuyển tới phòng mục tiêu.

## Cơ bản về AI {#cơ-bản-về-ai}

Mọi thứ trong game đều được điều khiển bởi AI (trí tuệ nhân tạo), tất nhiên chúng ta vẫn có thể chỉnh tay và điều phối các thủy thủ, nhưng AI không những tiện mà còn giúp ta định hình ra lối đánh của mình.

### Cách cài đặt AI {#cách-cài-đặt-ai}

Tại level 4, bạn có phòng CMD, phòng này có trị số Capacity và đó là số lệnh AI mà bạn có thể đặt được cho các phòng hay crew của mình.

![PSS guide illustration 22](/guide-images/image22.png)

Số dòng lệnh AI ở đây là 2:

![PSS guide illustration 23](/guide-images/image23.png)

### Điều kiện kích hoạt {#điều-kiện-kích-hoạt}

Một cài đặt AI là một phát ngôn dạng `NẾU <ĐIỀU KIỆN> THÌ <HÀNH ĐỘNG>` .

Game thực hiện tính trạng thái toàn bộ trò chơi mỗi giây 40 lần, gọi là 40 frame, tại mỗi framenếu mà `<ĐIỀU KIỆN>` là đúng thì phòng hay crew sẽ nhận `<HÀNH ĐỘNG>` để thực hiện tại frame đó.

*Ta thấy một crew đi từ phòng A sang phòng B hết 1s, trong thực tế, crew đó đã nhận 40 lệnh di chuyển liên tiếp trong 1 gây.*

Dưới đây là ví dụ về một số điều kiện:

![PSS guide illustration 24](/guide-images/image24.png)

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

### Hành động {#hành-động}

![PSS guide illustration 25](/guide-images/image25.png)

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

### Điều khiển thủ công {#điều-khiển-thủ-công}

Khi bạn điều khiển thủ công, thật ra là bạn đang thêm một cài đặt AI dạng KHÔNG: làm gì đó theo ý bạn lên đầu danh sách cài đặt AI. Lệnh làm gì đó của bạn cũng nằm vào một trong bốn nhóm hành động, giống như các cài đặt AI khác, và hiệu ứng khi bạn ghi đè sẽ khác nhau ở mỗi nhóm:

#### Chỉnh tiêu hao năng lượng

Bạn chỉnh năng lượng tiêu thụ cho phòng bằng cách kéo lên kéo xuống.

Mức năng lượng tối đa bạn có thể kéo chính bằng số HP hiện có của phòng. Ở chiều ngược lại, mức năng lượng tối đa mà lò phản ứng cung cấp được chính bằng số HP hiện có của nó.

\*Năng lượng là tài nguyên dùng chung ở tất cả các phòng. Khi bạn ghi đè mức sử dụng năng lượng ở một phòng, tát cả các AI quản lý năng lượng ở các phòng khác sẽ không hoạt động được nữa, điều này cực kì nguy hiểm nếu bạn gặp một đối thủ mạnh ngang hoặc hơn bạn.

#### Chọn đạn

Bạn chọn đạn bằng cách chọn đạn thế thôi. Và phòng sẽ bắn bằng đạn đó mãi. Cài đặt này không ảnh hưởng đến phòng khác.

#### Chọn mục tiêu

Khi bạn chọn mục tiêu cho phòng hay crew, phòng sẽ bắn mục tiêu ứng với điều kiện mà bạn đặt cho đến khi các phòng khả dĩ cũng loại bị phá hủy. Đối với crew, crew sẽ chọn phòng gần mình nhất thỏa mãn điều kiện.

#### Sử dụng năng lực

Bạn có thể ép crew sử dụng năng lực một cách thủ công, bằng cách nhấn đúp vô crew. Việc này chỉ thành công khi crew đang ở một nơi có thể sử dụng năng lực. Dễ hiểu là bạn không thể sử dụng kĩ năng Phá Hủy/Phóng Hỏa/Hack ở ngay tàu mình được.

\*\*\*Một lưu ý hết sức quan trọng về cơ chế:  
Độ ưu tiên sử dụng skill của Crew phụ thuộc và vị trí đứng bên trong hay bên ngoài phòng. Để dễ hiểu, hãy giả sử: Crew A của bạn đang đứng bên trong MLZ và đang có skill Tử quyền/Khí độc (Crit/Poison Gas). Tàu bạn lúc này có Crew B của địch đổ bộ lên với mục đích phá hủy tàu bạn, crew địch cũng có skill Crit/Gas. Crew B tìm đến phòng Crew A, 2 Crew tìm thấy nhau \<3. Lúc này chắc bạn sẽ nghĩ 2 crew A và B sẽ cùng thực hiện Tử quyền cùng một lúc\!? Nhưng KHÔNG Crew B sẽ tung đòn Tử quyền và kết liễu Crew A trước. Nói tóm lại, độ ưu tiên thực hiện skill crew đi từ ngoài vào phòng sẽ luôn luôn cao hơn crew đang đứng sẵn trong phòng bất kể đó là phe địch hay phe ta.

### Tổng kết {#tổng-kết}

Bài viết này chỉ viết về những điều cơ bản, về nguyên lý hoạt động của AI. Chúng ta sẽ có những bài viết khác về các chiến thuật, và sự tham gia không thể thiếu của AI trong đó.

## Training cho crew {#training-cho-crew}

Mục này chỉ cung cấp thông tin cơ bản. Chúng không sai nhưng hiện tại PSS Việt đã có giáo trình huấn luyện tiên tiến hơn training 2.0 dưới đây rất nhiều. Bạn đọc để tham khảo các yếu tố căn bản, trước khi đào sâu vào việc trở thành chuyên gia dinh dưỡng.

### Train là gì? {#train-là-gì?}

![PSS guide illustration 26](/guide-images/image26.png)Gym  
![PSS guide illustration 27](/guide-images/image27.png) Academy  
Là nói đến việc cho crew vào phòng Gym để luyện tập, và cho vào phòng Academic (học viện) để đi học. Luyện tập sẽ tăng các chỉ số sức khỏe, như tấn công, HP, kỹ năng, thể lực, sửa chữa. Đi học (là đi học lái tàu đó) sẽ tăng các chỉ số buff phòng như phi công, khoa học, kĩ sư, vũ khí.

### Các bài luyện tập {#các-bài-luyện-tập}

Bạn train bằng cách bỏ crew đứng vô phòng train, sau đó chọn bài tập luyện tập/bài học rồi luyện cho crew. Mỗi loại bài tập/bài học sẽ tăng một bộ chỉ số khác nhau, và thời gian luyện tập khác nhau. Sau khi thời gian luyện tập kết thúc, crew sẽ có cơ hội được tăng chỉ số mà bài tập đó hướng tới.

Có một lưu ý quan trọng đó là tất cả các bài luyện tập đều làm tăng nhiều chỉ số cùng một lúc. Trong đó luôn có môt chỉ số có khả năng tăng nhiều hơn những chỉ số khác, và đó là chỉ số mà chúng ta sẽ ngắm đến để train cho crew, ta gọi là chỉ số chính. Bạn có thể xem ví dụ thông qua ba bài luyện tập dưới đây.

![PSS guide illustration 28](/guide-images/image28.png)

Nếu muốn train để crew có thêm HP, chúng ta sẽ chọn bài tập Muscle Tournament hay Iron Man. Cả hai bài tập này đều có khả năng tăng luôn cả chỉ số Stamina. Con số phần trăm thể hiện lượng chỉ số tối đa mà crew sẽ nhận được sau khi train. Nói “tối đa” là vì nhận được bao nhiêu là hoàn toàn ngẫu nhiên, bạn thấy train có thể nhận được tối đa 11HP và 5 Stamina, nhưng sau khi train có khi bạn nhận được 0HP và 5Stamina cũng nên.

### Điểm train và thanh train {#điểm-train-và-thanh-train}

Cứ mỗi sau khi train mà crew tăng được một điểm chỉ số nào đó thì crew sẽ (bị) nhận được một điểm train. Điểm train của crew sẽ được thể hiện tại thanh train:

![PSS guide illustration 29](/guide-images/image29.png)

Tập luyện sẽ làm tăng thanh train. Sau khi train, cứ mỗi điểm chỉ số được tăng thành công thì thanh train sẽ tăng 1 đơn vị. Crew càng cao cấp thì thanh train càng dài và nhờ đó càng train được nhiều hơn. Các crew 7 sao hiện tại có thanh train dài 110 đơn vị. Crew captain có thanh train dài nhất là 200 đơn vị.

| Crew | Thanh train |
| :---- | :---- |
| [Một sao](https://pixelstarships.fandom.com/wiki/Common_Crew) | 50 |
| [Hai sao](https://pixelstarships.fandom.com/wiki/Elite_Crew) | 60 |
| [Ba sao](https://pixelstarships.fandom.com/wiki/Unique_Crew) | 70 |
| [Bốn sao](https://pixelstarships.fandom.com/wiki/Epic_Crew) | 80 |
| [Năm sao](https://pixelstarships.fandom.com/wiki/Hero_Crew) | 90 |
| [Sáu sao](https://pixelstarships.fandom.com/wiki/Special_Crew) | 100 |
| [Bảy sao](https://pixelstarships.fandom.com/wiki/Legendary_Crew) | 110 |
| [Captain](https://pixelstarships.fandom.com/wiki/Special_Crew#Starter_Captains) | 200 |

Độ dài của thanh train thể hiện khả năng crew có thể train được nhiều đến mức nào, và là một trong số các yếu tố đánh giá tiềm năng của crew.

### Hiện tượng “lì train” {#hiện-tượng-“lì-train”}

Công thức buff của crew

`Base Stat * (100%+Training Buff%) * (100%+Equipment Buff%)`

Nếu chỉ số không được tính theo % thì thay phép nhân thành phép cộng.

Có rất nhiều cơ chế khiến cho hiệu quả luyện tập giảm dần đi theo thời gian, mà chúng ta có thể gọi là sự “lì” train, các cơ chế đó bao gồm:

1. Crew có tổng chỉ số train (điểm train) càng cao thì càng lì

2. Chỉ số được train nhiều thì lì hơn chỉ số được train ít

3. Thanh train càng ngắn thì càng nhanh lì. Độ lì tại điểm train 27/90 là tương đương với tại điểm train 30/100.

Tới thời điểm hiện tại chưa có thông tin nào được phổ biến rộng rãi chỉ rõ cho chúng ta thấy công thức của các hiệu ứng trên như thế nào, rằng chúng là phép trừ hay phép phần trăm hay một phép nào khác. Nhưng mục đích của chúng chỉ có một, đó là gây khó khăn cho việc train các crew một cách hoàn hảo. Và qua đó làm cho trò chơi trở nên thú vị và đáng tìm hiểu hơn.

Hiệu ứng lì có thể được vượt qua bằng một pha sốc thuốc cực mạnh. Điều này sẽ được nói sau.

### Độ mệt mỏi {#độ-mệt-mỏi}

![PSS guide illustration 30](/guide-images/image30.png)

Sau khi tập luyện, crew sẽ bị mệt. Độ mệt mỏi của crew được đo bằng chỉ số mệt mỏi (fatigue), từ 0 đến 100\. Trò chơi không hiển thị con số chính xác của độ mệt mỏi và bạn chỉ có thể dự đoán chỉ số đó thông qua biểu cảm của các crew như trong hình trên.

Bài tập luyện càng dài thì càng mệt nhiều. Cụ thể ở mục “Các liệu trình train” dưới đây.

Cứ một giờ nghỉ thì điểm mệt mỏi của crew giảm đi 1\. Điểm sẽ bắt đầu giảm kể từ sau khi bài tập kết thúc, không cần biết bạn nhận kết quả train vào lúc nào. Một giờ là hợp lý, không lâu. Bạn sẽ cảm ơn trò chơi bởi vì nó lâu như thế.

Cứ mỗi điểm mệt mỏi, thành tích train của crew sẽ giảm 1%. Bạn cũng sẽ cảm ơn trò chơi vì nó giảm như thế. Chúng ta sẽ bàn về điều này sau.

### Các liệu trình train {#các-liệu-trình-train}

Có nhiều bài tập luyện, nhưng tựu trung lại thì có 3 chế độ mà chúng ta gọi là S1, S2 và S3. Chúng có hiệu quả train khác nhau, cấp độ càng cao thì chỉ số mang lại càng nhiều, và càng có khả năng vượt qua sự lì train cao hơn, đổi lại thời gian luyện tập và độ mệt mỏi mà chúng mang lại cũng nhiều hơn.

| Màu sắc | Hình thức | Thời gian | Độ mệt mỏi |
| :---- | :---- | :---- | :---- |
| ![This image has an empty alt attribute; its file name is MeditationGreenIcon.png](/guide-images/image31.png) | S1 | 45 phút | 1 |
| ![This image has an empty alt attribute; its file name is RunningBlueIcon.png](/guide-images/image32.png) | S2 | 3 tiếng | 6 |
| ![This image has an empty alt attribute; its file name is PunchingYellowIcon.png](/guide-images/image33.png) | S3 | 12 tiếng | 24 |

### Sự ngẫu nhiên của train {#sự-ngẫu-nhiên-của-train}

Kết quả train phụ thuộc rất nhiều vào sự ngẫu nhiên. Như ở trên có nói, một bài luyện tập được dự báo là cho \< 8% HP và \< 2 Stamina. Điều đó không có nghĩa là tỉ lệ bạn nhận được HP cao gấp 4 lần tỉ lệ bạn nhận được Stamina. Mà là cả hai chỉ số đó bạn đều có khả năng nhận được, và nhận được bao nhiêu thì là ngẫu nhiên từ 0 cho tới con số tối đa trong mô tả.

Vậy nên kết quả bạn nhận được hoàn toàn có thể là 0.4% HP và 1.9 Stamina.

### Sự làm tròn số {#sự-làm-tròn-số}

Cơ chế số ngẫu nhiên sẽ tạo ra các kết quả train ở số thực, và trò chơi sẽ làm tròn con số đó để tính ra kết quả nhận được (sau khi giảm trừ từ các yếu tố chai lì, tất nhiên). Chẳng hạn kết quả 0.4% HP ở trên sẽ được làm tròn về 0% HP và 1.9 Stamina thì thành 2 Stamina.

### Một số lưu ý cho người mới {#một-số-lưu-ý-cho-người-mới}

* Tập trung train chỉ một hoặc một vài chỉ số chính. Và bạn cần tìm hiểu rất kỹ rằng chính xác thì là chỉ số nào.

* Tuân train theo chế độ train 2.0, hay train 2.1, hay 2.0+, 2.1+ dưới đây.

* Nếu sau khi tính buff mà crew của bạn có HP là số thập phân, trò chơi sẽ làm tròn số trước mỗi trận chiến. Vậy nên tại khúc cuối của thanh train, bạn hoàn toàn nên dừng việc train khi HP của bạn lết được tới một con số có phần thập phân là 0.5. Train thêm thì cũng chỉ được cùng một lượng HP, thay vì thế nên chuyển sang train chỉ số khác.

### Training 2.0 {#training-2.0}

Hãy xem Lilith dưới đây, cô ta đã phí 1 điểm train vào sửa chữa, 2 điểm vào phi công, 4 điểm vào khoa học, 2 điểm vào kỹ sư, tổng cộng 9 điểm, trên tổng số 41 điểm đã train.

![PSS guide illustration 34](/guide-images/image34.png)

Đó là điều tương tự sẽ xảy ra với bạn nếu bạn đơn giản chỉ đặt crew vào phòng rồi train. Mỗi crew có chính xác một bộ chỉ số chính để train. Vấn đề là tất cả các bài luyện tập đều có thể làm tăng nhiều chỉ số một lúc. Thanh train thì có giới hạn và nếu bạn bị phí điểm vào những chỉ số vô ích thì bạn sẽ không có điểm để dùng cho những chỉ số có ích nữa.

Chúng ta cần lợi dụng các cơ chế “lì” trong việc train (đọc mục trước). Cụ thể là chúng ta làm cho crew bị lì, đến mức mà kể cả khi việc train có làm tăng chỉ số phụ đi chăng nữa, thì sau khi tính toán với các yếu tố “lì”, kết quả mang lại là nhỏ hơn 0.5, và ở bước làm tròn cuối cùng, trò chơi cho bạn kết quả 0% tại chỉ số phụ.

Cách thức này được gọi là Training 2.0, nó xuất hiện đâu đó vào năm 2019, nó lợi dụng rất đẹp chỉ số mệt mỏi, nó không yêu cầu bất kỳ sự đầu tư bux vào, và nó hiệu quả. Số lượng điểm bị phí có thể giảm xuống còn 1/10 hoặc ít hơn. Hãy xem những kết quả train đẹp dưới đây:

![PSS guide illustration 35](/guide-images/image35.png)![PSS guide illustration 36](/guide-images/image36.png)![PSS guide illustration 37](/guide-images/image37.png)![PSS guide illustration 38](/guide-images/image38.png)

Tổng quan phương pháp này như sau:

1. Bạn từ tốn làm cho crew mệt thật là mệt, bằng những bài tập nhỏ (có khả năng vào chỉ số phụ thấp)

2. Crew đã mệt sẽ rất lì train, đó là lúc chúng ta liên tục dùng những bài tập có hiệu quả cao nhất để train. Cho tới lúc mặt crew xanh đến mức không xanh hơn được nữa (lúc đó có train tiếp cũng không được gì) thì dừng và cho crew nghỉ.

3. Cho crew nghỉ tới một độ mệt mỏi nhất định mà tại đó crew vẫn lì

4. Lặp lại bước 2 và 3 cho đến khi chịu không train được nữa

Bước 1 là bước quan trọng nhất, bước 1 cần phải hoàn thành trọn vẹn trước khi chuyển sang các bước tiếp theo. Nếu quá trình train của bạn gián đoạn ở bất kỳ lúc nào, bạn cần thực hiện lại bước 1 từ đầu, kể cả khi không lên được điểm nào. Ở bước đó chúng ta cần crew mệt chứ không có cần lên chỉ số.

Cụ thể, các bước của training 2.0 như sau:

1. Khởi động  
   1. train S1, lặp lại 11 lần để sang mặt F1-10  
2. Làm nóng  
   1. rain S3 liên tục đến chết  
3. Train giai đoạn 1  
   1. nghỉ đến khi crew sang mặt F21-30  
   2. train S3  
   3. lặp lại 2 bước trên đến khi thanh train đầy 45% (45% của thanh train, không phải 45 điểm train)  
4. Train giai đoạn thanh train đầy hơn 45%  
   1. nghỉ đến khi crew sang mặt F11-20  
   2. train S3  
   3. lặp lại 2 bước trên đến khi thanh train đầy 55%  
5. Train giai đoạn thanh train đầy hơn 55%  
   1. nghỉ đến khi crew sang mặt F1-10  
   2. train S3  
   3. lặp lại 2 bước trên đến khi thanh train đầy 65%  
6. Train giai đoạn thanh train đầy hơn 65%  
   1. nghỉ đến khi crew sang mặt F0  
   2. train S3  
   3. lặp lại 2 bước trên đến khi bạn đầu hàng

### Training 2.0+ {#training-2.0+}

Khi train 2.0, giai đoạn khởi động và làm nóng khá nguy hiểm, vẫn có tỉ lệ bạn ăn đòn chỉ số phụ bởi lúc đó thanh train của bạn còn thấp. Nếu bạn bị dính như thế, bạn có hai lựa chọn.

Một là chấp nhận hiện thực và chịu phí một vài điểm chỉ số.

Hoặc hai là bạn cứ tiếp tục làm nóng đến khi crew chuyển sang mặt F91-100, sau đó uống thuốc reset tiến trình train (khoảng 300 bux trên chợ). Thuốc này sẽ reset thanh train và xóa bỏ mọi kết quả train trước đó, nhưng không xóa bỏ điểm mệt mỏi. Vậy là bạn có một crew sẵn sàng để bắt đầu vào ngay bước thứ 3 của quá trình train 2.0. Cách này gọi là 2.0+.

Một vài ví dụ về kết quả sau giai đoạn làm nóng theo cách này:

![PSS guide illustration 39](/guide-images/image39.png)![PSS guide illustration 40](/guide-images/image40.png)

Và kết quả cuối cùng:

![PSS guide illustration 41](/guide-images/image41.png)

### Training 2.1/2.1+ {#training-2.1/2.1+}

Như phân tích ở trên, mục đích của việc làm nóng là để điểm mệt mỏi của crew đủ cao, để crew đủ lì, để kết quả train chỉ số phụ luôn nhỏ hơn 0.5 và không ăn vào kết quả train.

Một nhược điểm của training 2.0 là loằng ngoằng tốn thời gian và cứng nhắc, bạn không nhất thiết phải train crew đến khi đạt mặt 100 rồi mới cho nghỉ và rồi lặp lại. Bạn chỉ cần biết rằng với thanh train hiện tại của mình thì train ở độ mệt mỏi nào thì an toàn là được.

Mức mệt mỏi để train S3 an toàn phụ thuộc vào điểm train của crew, điểm train cao thì crew sẽ rất lì nên độ mệt mỏi cần thiết sẽ thấp hơn (cho nghỉ lâu hơn). Điểm train còn thấp (crew mới train) thì crew không lì lắm, và cần được train khi mệt hơn (cho nghỉ ít hơn). Cụ thể bạn có thể theo biểu đồ sau:

![PSS guide illustration 42](/guide-images/image42.png)

Bạn chỉ cần đừng train ở độ mệt mỏi thấp hơn so với biểu đồ để an toàn là được, cách này sẽ giúp bạn train uyển chuyển hơn và đỡ căng thẳng hơn. Cũng như giảm bớt được thời gian train ở những mức mệt mỏi quá cao không cần thiết.

Bạn vẫn có thể áp dụng thủ thuật reset thanh train khi sử dụng biểu đồ này.

Chúc các bạn thành công.

# Xây dựng lối đánh {#xây-dựng-lối-đánh}

## Tổng quan về các lối chơi {#tổng-quan-về-các-lối-chơi}

Dịch từ tài liệu gốc [Overview‌ ‌of‌ ‌the‌ ‌Playstyles‌ ‌in‌ ‌Pixel‌ ‌Starships – ‌ ‌Uncle‌ ‌Jarvan‌](https://docs.google.com/document/d/1qN2TSvmm-XXK1RLcB9tQUhAZA2PwoXCrnE6FE7hoCcA/edit?usp=sharing)‌, phiên bản ngày 3/23/2019.‌

Trong PSS, mục tiêu của các lối chơi là để đạt được mục đích mà bạn nhắm đến một cách hoàn hảo và hiệu quả và hoàn hảo nhất có thể. Có một điều tuyệt đối, đó là tuyệt đối không có lối chơi nào tuyệt đối vô địch. Luôn có một điểm yếu tồn tại trong một lối chơi mạnh, bởi vì luôn có giới hạn bao quanh việc thiết kế một tàu hoàn hảo; giới hạn đó có thể đến từ tàu, crew, hay AI.

Tài liệu này được tác giả thiết kế để đưa ra lời khuyên và hướng bạn đến gần hơn với lối chơi sinh ra dành cho bạn.

### Các thuật ngữ về lối chơi {#các-thuật-ngữ-về-lối-chơi}

**Súng** ‌-‌ ‌‌ám chỉ MLZ, PLA, hay bất kỳ thứ gì nằm trong nhóm Vũ khí laser (xem bài viết [Cẩm nang các loại vũ khí tầm xa](http://27.73.126.49/ship/1151/cam-nang-cac-loai-vu-khi-tam-xa/)).‌

**Pháo** ‌-‌ ‌‌Ám chỉ pháo ION hay pháo EMP, hay bất kỳ vũ khí gì thuộc nhóm Pháo.‌ ‌

**Tên lửa** ‌-‌ ‌‌Ám chỉ phòng phóng tên lửa như MSL,‌ ‌MML hay một loại tên lửa nào đó như‌ ‌Penerators,‌ ‌Scarletts,‌ ‌Junglers,‌ ‌Rockets,‌ ‌Hỏa giáo v.v.‌ ‌

**Máy bay‌** ‌-‌ ‌‌Ám chỉ những vật thể bay được phóng từ Hangar.‌ ‌

**Điều kiện thắng‌** ‌(thứ nhất,‌ ‌thứ hai,‌ ‌thứ ba)‌ ‌-‌ ‌‌ ám chỉ một tập các cách để chiến thắng mà tàu bạn tập trung hướng tới. Bất kỳ cách nào thì cũng đều phải có kết quả là khiến tàu địch HP về 0\. Chẳng hạn cách thứ nhất là khiến tàu địch ngập trong đạn từ súng chính, nếu không được thì còn cách thứ hai dự phòng là thúc pháo ION.

Chiến thuật nâng cao ‌-‌ ‌‌Ám chỉ các **điều kiện thắng phụ**. Chẳng hạn như đổ bộ là điều kiện thắng dự phòng, bởi chúng giúp tăng hiệu quả của điều kiện thắng chính bằng cách triệt hạ crew và các hệ thống hoạt động của tàu đối phương.

### Các lối chơi thông dụng nhất {#các-lối-chơi-thông-dụng-nhất}

#### Pháo hạm

Gunship là những tàu sử dụng hệ thống súng laser làm nguồn sát thương chính. Phần lớn người chơi sử dụng lối chơi này, bởi về bản chất, để sử dụng bất kỳ lối chơi nào khác thì đều cần các điều kiện phụ đắt đỏ và mạnh mẽ thì mới triển khai được. Nên là, chỉ việc nâng cấp phòng, và bắn tập trung bằng các súng chính trên tàu của bạn, thật mạnh, là một lối chơi đơn giản và không yêu cầu quá mức hà khắc.

Sức mạnh của gunship nằm ở khả năng bắn tập trung vào một phòng duy nhất. Tuy vậy nó không có nhiều điều kiện thắng thứ cấp, cũng như dễ yếu đi trước các chiến thuật nâng cao của tàu địch nếu không được cân chỉnh cẩn thận.

#### Pen(-netration) Gunship (Pháo \+ Pen)

Đây cũng là một trong các lối chơi tiêu chuẩn. Nó tập trung vào việc sử dụng các phòng bắn tên lửa (2 MSL, và tốt hơn hết là có cả MML) để tối đa hóa DPS thông qua các tên lửa xuyên phá. Tuy vậy, tàu chơi Pen không chỉ sử dụng tên lửa Pen để làm nguồn DPS, nó cũng dùng súng laser để tăng sát thương.

Tàu chơi Pen mạnh ở chỗ có khả năng gây sát thương trực tiếp thân tàu, và được bổ sung một lượng sát thương không nhỏ từ súng laser. Tuy vậy nó dễ bị vô hiệu hóa, hay bị bắt bài bởi các tàu có phòng Engine được buff đầy đủ.

#### Pen(-netration) Hull-splider Gunship (Thuần pen)

Lối chơi này là biến thể của tàu chơi Pen, nhưng có điểm khác là nó chỉ sử dụng tên lửa làm nguồn sát thương duy nhất. Bằng việc loại bỏ các nguồn gây sát thương khác, nó có được khả năng trang bị và buff thật tốt Engine, Khiên, Pin khiên, để phòng thủ thật tốt trong khi các tên lửa từ từ rỉa HP của tàu đối phương. Các droid sửa chữa và phòng thủ hoạt động hiệu quả một cách kỳ diệu trên loại tàu này.

Lối chơi này có sức phòng thủ rất mạnh, và rất khó chịu. Tuy vậy nó rất yếu trước các tàu Disabler, cũng như trước các tàu có engine được buff đầy đủ.

#### Raider Gunship (Gunship \+ Tập kích)

Lối chơi này dựa trên gunship nguyên thủy, trang bị thêm một biệt đội crew đổ bộ để tấn công các hệ thống chức năng của tàu địch. Một khi có hệ thống trên tàu đối phương bị thủng thì các súng trên tàu sẽ tấn công dồn dập vào đó và gây một nguồn sát thương thân tàu khổng lồ. Tàu raider cần có một nguồn gây sát thương chính đủ tốt, bởi tự thân crew đổ bộ không thể gây sát thương thân tàu được. Rush crew đỏ bộ là một chiến thuật hiệu quả để tăng tốc quá trình đổ bộ.

Biệt đội đổ bộ của tàu raider hoàn toàn có thể lật ngược thế cờ, bởi chúng kích hoạt AI sửa chữa của tàu địch. Một đội biệt kích mạnh có thể đóng tại một phòng đối phương, chờ và diệt crew sửa chữa của tàu địch chạy tới, từng con một.

Tuy vậy, tàu raider sẽ mất đi lợi thế của mình khi:

* Gặp phải một tàu raider khác có đội bổ bộ mạnh hơn

* Bị tàu đối phương EMP hay hack phòng dịch chuyển

* Tàu đối phương có thiết kế thủ đổ bộ kín kẽ

#### Carrier Gunship (Gunship \+ Máy bay)

Còn được gọi đơn giản là carrier, tàu chơi lối này tập trung vào hai điều kiện thắng: súng bắn focus fire, và rush hầm máy bay. Lối chơi này yêu cầu crew rush mạnh để có thể rush 3-5 máy bay trong thời gian tối đa 1-3 giây. Chỗ dựa của lối chơi này nằm ở khả năng gây sát thương không chỉ từ bộ súng chính mà còn từ các máy bay.

Tàu theo lối chơi này có sát thương laser cao đáng kể, gần như có thể luôn giữ phòng mục tiêu ở trạng thái “nát”. Ưu tiên của nó là vô hiệu hóa AA bằng pháo EMP, tên lửa EMP cũng như bắn hỏng nó bằng hỏa lực tập trung.

Điểm yếu của tàu này:

* Đắt đỏ, bộ crew rush không đủ mạnh sẽ khiến các máy bay gần như luôn bị hạ lần lượt trước khi có thể bắt đầu bắn.

* Tàu đối phương có crew tank với HP cao có thể khiến bạn không thể nhanh chóng phá nát AA của đối phương và khiến bạn mất dần các máy bay cũng như mất đi lợi thế đến từ hỏa lực cao ở đầu trận.

### Các chiến thuật nâng cao {#các-chiến-thuật-nâng-cao}

#### Disabler Gunship (Gunship \+ Vô hiệu hóa)

Rất ít người chơi sử dụng lối chiến thuật này. Nó trang bị 2 MSL bắn tên lửa EMP kết hợp cùng với pháo EMP để vô hiệu hóa các hệ thống cốt lõi trên tàu đối phương như pháo ION, pháo EMP, phòng dịch chuyển; trong khi đó bộ súng chính sẽ đấm thân tàu địch. Khả năng vô hiệu hóa 3 hệ thống chính của tàu địch là rất đáng sợ. Nhưng điểm yếu của tàu này là thiếu hụt sát thương tổng thể khi đối chiếu với các lối chơi khác.

#### Disabler Gunship-Carrier (Gunship \+ Sân bay \+ Vô hiệu hóa)

Tàu này tương tự như Disabler Gunship, ngoại trừ một Hangar được bổ sung vào để làm nguồn sát thương phụ. Tàu này thường vô hiệu hóa 2 AA, pháo ION, và TLP. Nó vẫn có khả năng vô hiệu hóa cùng lúc 3 hệ thống chính của tàu địch, nhưng được bổ sung điều kiện thắng thứ ba đến từ các máy bay. Nhược điểm của nó là DPS thấp hơn, và yếu trước các tàu Raider.

#### Ion‌ ‌Rusher‌ ‌“Death‌ ‌Rey”‌ ‌Gunship‌ (Gunship \+ Rush ION kiểu “Tia chết”)

Tàu rush ION tập trung vào việc rush pháo ION để làm nguồn gây sát thương chính bên cạnh các súng khác. Mục tiêu là có đủ crew rush để rush phá ION càng nhiều càng tốt và qua đó gây tối đa sát thương. Pháo canon rất hiệu quả để diệt crew cũng như rút HP thân tàu từ những phòng đã nát. Tuy vậy tàu này sẽ mất sức mạnh một khi ION bị EMP, nó rất yếu trước các tàu Disabler.

#### Turle Ship (Tàu thủ)

Mục tiêu tối thượng của tàu theo lối chơi này có lẽ là dẫn trận chiến đến kết quả hòa. Nghe lạ nhưng nó thực sự là một lối chơi được áp dụng. Nó sử dụng các rusher để thường xuyên rush cloak, và các crew có sci cao để hồi khiên liên tục. Nó cũng đặt crew để buff engine. Tất cả để kéo dài thời gian mà tàu này không nhận sát thương. Nó không có mục đích gây sát thương, và yêu cầu rất cao ở AI, nhưng bạn rất khó hạ được nó, trừ khi bạn là một Raider mạnh.

#### Turle Ship Disabler (Tàu thủ \+ Vô hiệu hóa)

Tàu này thực chất là một turle ship nhưng được trang bị thêm tên lửa EMP để giảm sát thương tổng thể của đối phương, và tăng thời gian sống của “rùa”. Mục tiêu EMP thường là pháo EMP, pháo ION, và TLP của đối phương. Tàu này ít sợ tàu raider hơn, nhưng đổi lại nó yếu trước các Gunship.

#### Android‌ ‌“Voarder‌ ‌Droidicas”‌ ‌Gunship‌ ‌(Biến thể của‌ ‌Raider‌ ‌Gunship)‌

Tàu này tập trung vào triển khai hai phòng android có thể sản xuất droid đổ bộ là AS và VM. Trong lúc sử dụng bộ súng chính để làm nguồn gây sát thương, cùng với một vài crew đổ bộ làm điều kiện thắng thứ hai, các droid đổ bộ được sản xuất liên tục bởi xưởng robo sẽ quấy phá tàu địch. Bởi bản chất đổ bộ ngẫu nhiên, các droid có khả năng quấy nhiễu AI sửa và phòng thủ của tàu địch, cũng như đục nát phòng đối phương để tạo mục tiêu bắn có thể gây sát thương thân tàu cho bộ súng chính. Droid đổ bộ là điều kiện thắng thứ ba của tàu này, và nó nó thể bị phế bỏ nếu TLP bị EMP. Lối chơi này yếu trước tàu Disabler.

#### Tele ‌Spam

Tàu này là một biến thể của Raider, nó triển khai tối đa số lượng rusher để đẩy đi một lượng lớn crew, không phải một hay một vài, mà là một lượng lớn ngập tàu đối phương. Mục tiêu của quân đổ bộ là vô hiệu hóa tàu địch bằng cách tiêu diệt crew và các hệ thống hoạt động, qua đó khiến tàu địch mất sức chống đỡ trước hỏa lực của tàu. Lối-chơi-này-rất-mạnh. Không phải là điểm yếu của bản thân tàu này, nhưng nó gặp khó khăn trước các tàu địch có crew đóng băng, các tàu có trang bị nhiều module, hay các tàu chú trọng sử dụng droid phòng thủ của VM/AS.

#### The‌ ‌Capital‌ ‌Ship (Chủ Hạm)

Như tên gọi, tàu này có khả năng triển khai mạnh mẽ ba điều kiện thắng khác nhau: Gunship, Raider, và Carrier. Thường thì với 5 rusher cho Hangar và 1-5 crew tele. Một khi có thể triển khai được, lối chơi này rất mạnh bởi cả ba điều kiện thắng đều rất mạnh mẽ. Điểm yếu (có thể là) nằm ở khả năng phòng thủ trước tàu spam tele mạnh tương đương, hoặc trước một tàu có lối chơi tương tự nhưng xuất sắc hơn.

#### Chủ Hạm 2The‌ ‌Capital‌ ‌Ship‌ ‌v.2

Biến thể này sử dụng thêm cloak. Nhờ có cloak, tàu này có khả năng triển khai lính đổ bộ và máy bay hiệu quả và an toàn hơn. Khá là khó để hạ tàu này, nói chung không có quá nhiều điểm yếu rõ ràng.

#### The‌ ‌Hidden‌ ‌Penetrating‌ ‌Raider (Tàu xuyên phá Tàng hình)

Tàu này sử dụng phòng cloak thật mạnh. Nó cũng cần trang bị VM và AS. Nó sử dụng thời gian có cloak để phòng thủ, nạp năng lượng cho TLP để gửi raider đi, và đồng thời bắn tên lửa xuyên phá. Lối chơi rất khó chịu. Nhưng tàu này có thể bị counter bởi tàu Disable hay những tàu có engine mạnh.

#### Cycles‌ ‌of‌ ‌Disabler‌ ‌Gunship‌ ‌Carrier‌(Cấm hạm)

Mục tiêu của tàu này là “silence” hoàn toàn tàu địch. Nó sử dụng 2 MSL, 1 MML, pháo EMP, PP, PD, và các máy bay Cosair – tất cả những gì có thể gây EMP – để hoàn thành cấm thuật. Tổng cộng 21 năng lượng – nhưng thực tế nó cần rush Hangar thế nên phòng HAN sẽ chỉ cần đặt 1 năng lượng, đưa năng lượng mana cần thiết xuống còn 18\. Lượng năng lượng còn lại được phân bổ cho bộ vũ khí laser để hạ gục tàu địch. Tàu này khó bị thua trận, nhưng bởi DPS khá thấp, nó cũng thường hay gặp kết quả hòa nếu tàu địch có crew phòng thủ tốt.

# Triển khai lối đánh {#triển-khai-lối-đánh}

## AI súng {#ai-súng}

... chờ ai đó viết, trong thời gian đó, dễ nhất là tham khảo menu AI tại [PPG \- Intro to Room AI (pixelperfectguide.com)](https://pixelperfectguide.com/room-ai/intro-to-room-ai/) 

![PSS guide illustration 43](/guide-images/image43.png)

## AI buff room {#ai-buff-room}

... chờ ai đó viết

## AI sửa chữa {#ai-sửa-chữa}

... chờ ai đó viết

## AI thủ {#ai-thủ}

## Đổ bộ và chống đổ bộ {#đổ-bộ-và-chống-đổ-bộ}

### Giới thiệu {#giới-thiệu}

Mục đích của hướng dẫn này là để cung cấp một nguồn tài nguyên tham khảo toàn diện về cách phản công trước các crew đổ bộ. Tài liệu này giả sử rằng bạn đã quen thuộc với AI và các thuật ngữ khác trong trò chơi, như dịch chuyển, đổ bộ… Nếu bạn là người chơi mới, bạn nên tham khác các tài liệu khác trước khi đi đến hướng dẫn này; phần lớn nội dung ở đây chỉ liên quan đến những người chơi đã thuần thục và gần như đã đi đến end-game hay tương tự thế.

Hướng dẫn này bao phủ cả điểm mạnh và điểm yếu của ba chiến thuật đổ bộ chính trong trò chơi, kèm theo phân tích các phương án khác nhau để một người chơi có thể phản công trong đa số các trường hợp, và, quan trọng nhất, một triết lý để phát triển tàu một cách hiệu quả về mặt chi phí, mà có thể áp dụng cho mọi chiến thuật. Ngoài ra còn có các cài đặt AI gợi ý mà tác giả có thể chia sẻ trong chừng mực, để giúp bạn đọc phát triển tàu và lối chơi một cách tốt hơn.

Cuối cùng, luôn nhớ rằng PSS cuối cùng đơn thuần là một trò chơi Búa-Kéo-Giấy. Bằng hành động chỉnh tàu của bạn để đối phó với đổ bộ, bạn sẽ mất bớt đi khả năng đối phó với các chiến thuật khác, chẳng hạn như gunship hay pen-spam. Tài liệu này không hướng dẫn bạn tìm ra điểm cân bằng thích hợp nhất cho bạn, bởi mỗi người sẽ có tập crew, tàu, level, sở thích khác nhau mà tác giả không thể dự đoán trước. Vậy nên hãy chỉ tập trung vào các luận điểm của nó xoay quanh chủ đề chống-đổ-bộ.

— Amino^\#8666

### Các loại hình đổ bộ {#các-loại-hình-đổ-bộ}

Để phản đòn một cách thích hợp, điểm mấu chốt là hiểu cách hoạt động của mỗi loại hình đổ bộ. Tựu chung lại có ba phòng chá chính, với điểm mạnh và điểm yếu riêng.

#### Đổ bộ đơn giản, cơ bản

| Ưu điểm | Yếu điểm |
| :---- | :---- |
| • Ít phải đầu tư. • Hoạt động tốt như một chiến thuật bổ sung bên cạnh lối chơi chính của tàu. • Thiết lập vô cùng dễ dàng. | • Quân đổ bộ được gửi một cách chậm chạp, và theo đó rất dễ bị vô hiểu hóa bởi EMP, crew địch, hay do bị tàu địch bắn trực tiếp. |

Chiến thuật này thường gặp ở những tàu level thấp, hay được sử dụng như chiến thuật bổ sung cho những tàu level cao. Nó rất dễ triển khai; đơn giản là xác định ra một vài crew làm quân đổ bộ, và nếu có thể thì thêm một vài crew buff TLP. Một phương án khác là sử dụng droid làm quân đổ bộ, hoàn toàn không tốn chi phí crew, trong khi vẫn phục vụ được mục tiêu gây sát thương. Cho dù là dùng cách nào đi chăng nữa, AI để triển khai lối đổ bộ này cũng vô cùng đơn giản.

#### Đổ bộ gấp

| Ưu điểm | Yếu điểm |
| :---- | :---- |
| • Gửi quân đổ bộ SIÊU nhanh • Thứ tự dịch chuyển có thể dễ dàng sắp đặt để chống mìn, gửi tank chịu dmg… và nhiều mục đích chiến chuật khác. | • Đầu tư lớn • Nếu không được bảo vệ đủ tốt, TLP có thể không hoạt động mượt và kế hoạch đổ bộ gặp trục trặc. • AI rush có thể bị ngắt phụ thuộc vào nhiều điều kiện khác nhau. • Crew rush hay bị “lắc”. |

Chiến thuật này được định hình bởi hai (đôi khi là một) hàng crew chạy thục mạng tới TLP ngay từ đầu trận combat. Nó hoạt động nhờ các crew rush 100% chạy vào TLP, sử dụng skill, và chạy ra ngay lập tức. Điều đó giúp TLP được rush liên tục để gửi quân đổ bộ tới tàu địch.

Cách làm này gửi quân siêu nhanh. Nó dễ dàng gửi 5+ crew đổ bộ tới tàu địch chỉ trong vài giây, nhanh chóng vô hiệu hóa phòng, diệt crew, ngắt năng lượng, hack… tàu địch.

Sức mạnh của chiến thuật này nằm ở khả năng gửi một lượng lớn đến mức nguy hiểm các crew đổ bộ. Nếu gửi không được nhiều, hay nếu đội đổ bộ không đủ mạnh để có tính chất “nguy hiểm”, chiến thuật này sẽ thành làm màu. Do đó nó yêu cầu một lượng tài nguyên khổng lồ để đầu tư; cứ mỗi crew đổ bộ cần gửi, bạn cần một crew rush được train cũng như được mặc trang bị đầy đủ, và không những thế còn phải có khả năng làm một việc gì đó khác sau khi rush xong (chính “việc khác” đó đôi khi khiến rusher lâm vào trạng thái “lắc”). Bên cạnh đó, nếu bạn có khả năng ngắt phòng TLP (bằng EMP), hay ngắt AI (hoặc đập phát chết luôn) rusher, bạn sẽ dễ dàng đánh gãy cánh tàu địch.

#### Đổ bộ trong tích tắc

| Ưu điểm | Yếu điểm |
| :---- | :---- |
| • Đảm bảo gửi toàn bộ quân đổ bộ cùng một lúc. • Gửi quân SIÊU nhanh. • Khó bị phản công. | • Cần đầu tư mạnh tay. • Cần cloak. • Quân đổ bộ dễ mắc phải mìn hay skill từ crew phòng thủ của địch. • AI rush có thể bị ngắt theo nhiều cách khác nhau. • Crew rush hay bị “lắc” bởi nhiều nguyên nhân khác nhau. |

Cách này tương tự như cách gửi quân liên tục; điểm khác biệt cốt lõi là nó sử dụng thêm rush cloak. Tàu sẽ ngay lập tức cloak ở đầu game, trong thời gian đó các crew đổ bộ sẽ được “tích” vào phòng TLP. Ngay khi hết cloak, tất cả các crew đã “tích” trước đó sẽ được gửi, cùng một lúc.

Cách này có cùng ưu điểm với cách gửi quân đổ bộ liên tục: gửi rất nhanh, và nhiều. Nhanh và nhiều là mấu chốt để tàu chơi đổ bộ có thể chiến thắng. Đồng thời, sử dụng cloak giúp đảm bảo quân đổ bổ được gửi đi thành công, giảm khả năng gặp các biến cố như tên lửa hay pháo EMP.

Chiến thuật này RẤT khó counter, nhưng vẫn có thể. Quân đổ bộ vẫn có khả năng dính mìn hay gặp phải crew mang skill thủ, như băng, độc, hay tử quyền. Một vài chiến thuật AI có thể hạn chế đáng kể số lượng crew đổ bộ được dịch chuyển sang. Và quan trọng nhất, cách đổ bộ này yêu cầu đầu tư crew vô cùng khổng lồ, và khả năng thắng của tàu chơi lối này phụ thuộc gần như hoàn toàn vào crew, nếu bạn sắp xếp cẩn thận để đập được quân đổ bộ thì tàu địch sẽ coi như xong.

### Các giải pháp chống đổ bộ {#các-giải-pháp-chống-đổ-bộ}

Mọi chiến thuật đổ bộ đều nhắm đến một điều kiện thắng: diệt hết crew địch và sau đó súng/tên lửa trên tàu sẽ kết thúc tàu địch. Vậy nên, thay vì nghĩ xem làm thế nào để bắt bài một chiến thuật đổ bộ cụ thể nào đó, sẽ hiệu quả hơn nếu ta cải thiện khả năng chống đổ bộ trên diện rộng. Phần này sẽ gợi ý giải pháp để làm điều đó, nhưng vẫn giữ khả năng bắt bài các chiến thuật đổ bộ cụ thể khác nhau.

#### Tư duy

Một phương án tốt, không cần biết là phòng hay chống, đều phải hiệu quả về mặt chi phí.

Nếu bạn có thể đập được quân đổ bộ, bạn thắng. Về lý thuyết đơn giản là như vậy.

Có hai phương án được đưa ra: phòng và chống:

* Phòng: vô hiệu hóa khả năng đổ bộ của địch.  
* Chống: giao tranh với quân đổ bộ sau khi chúng đã cập lên tàu bạn.

Bên cạnh đó, khi ước tính, phương án đó phải hiệu quả về mặt chi phí, nôm na là đáng giá. Nếu bạn đổi 9 crew của bạn chỉ để diệt 4 crew đổ bộ, tàu địch sẽ hơn bạn về crew, còn tàu bạn sẽ mất DPS trong suốt phần còn lại của trận combat, như thế là không hiệu quả. Tính hiệu quả sẽ xuyên suốt phần còn lại của bài viết này.

#### Xếp layout và đặt crew

##### Bố trí crew

Khả năng để đối phó với quân đổ bộ nằm ở crew của tàu bạn. Theo đó, tàu khỏe là tàu có crew tốt, được chuẩn bị tốt, để chuyên trị đối phó với crew đổ bộ. Không phải cứ càng nhiều crew như thế là càng tốt, nhưng phải đủ một số lượng hợp lý.

Crew thủ đổ bộ cần có skill bom băng hay tử quyền, và ngoài ra cần có thêm khả năng đứng súng (nhiệm vụ khác cũng tốt, nhưng đứng súng là tốt nhất, liên quan đến vấn đề xếp layout). Legend thì có thể kể đến Galatic Maiden và Lilith, non-legend có thể kể đến Hydra, Namith, Gấu Bắc, Quan Vũ, Lưu bị, Ichigo, Tiger Wood. Các crew có skill bom gas cũng dùng được, chẳng hạn như Taura.

Lấy ví dụ, Gấu Bắc có chỉ số Weapon tốt, bên cạnh HP và ATK khá cao. Quan trọng nhất là nó có skill bom băng, một khi được sử dụng sẽ đóng băng toàn bộ quân đổ bộ có trong phòng, sau đó thì mặc sức cho gấu đánh tay và có thể tiêu diệt được từ 1-3 crew đối phương (đáng giá). Vậy nên Gấu Bắc sẽ hữu dụng để đứng súng trong khi vẫn có khả năng đối kháng trong combat đổ bộ.

Hoặc một ví dụ khác, Lilith, một crew legend, với chỉ số WP, ABI, ATK, HP cao ngất. Nó vừa có khả năng làm một trong những crew đứng súng tốt nhất game, lại vừa có khả năng đấm phát chết luôn phần lớn crew đổ bộ nếu được train và trang bị item hợp lý. Có nhiều lilith sẽ tăng DPS của tàu bạn một cách rõ rệt, bên cạnh khả năng đối kháng đổ bộ. Hay một crew khác cũng đáng nói đến ở đây, Galatic Sprite. Đây không phải là một crew đứng súng, nó có HP cao, tốc độ chạy nhanh, đi nhanh bằng chạy (không cần tới stamina), stat sửa cao, stat SCI và ENG khá, skill bom băng hữu dụng.

Có thể nói Galatic Sprite và Lilith là những crew giá trị nhất game tại thời điểm hiện tại, hãy ưu tiên press hai crew này nếu bạn có thể.

##### Xếp đặt các phòng

Layout thường bị những người chơi có một chút kinh nghiệm coi nhẹ. Trong thực tế tối ưu hóa cách xếp đặt các phòng có thể giúp bạn đơn giản hóa AI, tăng tốc độ phản ứng trước quân đổ bộ, và chiếm lợi thế combat. Có một số chiến thuật xếp phòng hữu dụng như sau.

###### *Phòng bảo vệ ngay bên trái*

Vị trí của mỗi phòng trên tàu của bạn phải có một mục đích cụ thể. Khi một crew di chuyển tới phòng mục tiêu, đi vào từ bên trái , hay nói cách khác, đi vào từ phía đuôi tàu sẽ tốt cho nó hơn. Trước khi crew có để đứng vào một trong các slot phòng, chúng sẽ không thể giao tranh tay đôi được, và sẽ hứng đạn của crew địch vô ích (xem bài viết [Cơ chế giao tranh đổ bộ và chống đổ bộ](http://27.73.126.49/co-che/808/crew-combat-101/)).

Vậy nên bạn nên xếp đặt các phòng sao cho các phòng thường được quân đổ bộ nhắm đến (REA, đặc biệt là REA) nằm ở ngay bên phải các phòng có crew phòng thủ, để có thể triển khai combat phòng thủ một cách nhanh nhất.

![PSS guide illustration 44](/guide-images/image44.png)

Trong hình trên, REA tận cùng bên trái và FREA không được tuân theo quy tắc này, vậy nên chúng được đặt mìn (sẽ giải thích rõ hơn ở phần sau).

###### *Cửa cảnh vệ*

Cũng trong hình trên, bạn có thể để ý thấy rằng để có thể di chuyển từ REA này đến REA kia, crew đổ bộ cần phải đi qua một phòng laser, và tại đó nó sẽ đụng độ với crew phòng thủ. Chiến thuật này được gọi là “cửa cảnh vệ”, bạn ép crew địch phải nhận một tấn skill tấn công cùng một lúc. Cho phép crew của bạn tập trung đứng súng, thay vì phải đuổi theo lính đổ bộ, mà không làm mất đi khả năng phòng thủ của tàu.

###### *Tránh kẹt thang*

Kẹt thang là ác mộng khi cần phòng thủ đổ bộ. Nó ảnh hưởng xấu đến thời gian phản ứng của crew phòng thủ cũng như crew sửa chữa, tạo điều kiện để crew địch gây hư hại lên phòng, khiến tàu mất khả năng hoạt động ổn định và dễ bị nhận sát thương thân tàu. Hãy thiết kế layout để giảm tối đa thời gian crew phải chờ thang, trong phạm vi có thể.

##### Mìn và rào chắn

Mìn SIÊU hữu dụng khi dùng để bẫy các tàu chơi tele ở giai đoạn đầu và giữa game. Chúng gây một tấn dmg và thường có thể thổi bay hầu hết crew đổ bộ. Tuy vậy, tại mức rank cao, mìn thường bị vô hiệu hóa bởi EMP, có thể là từ pháo/tên lửa EMP, hay bởi hiệu ứng của crew collection như bộ Savy hay Ardent.

Từ đó, module rào chắn trở nên phổ biến hơn ở REA vì một số lý do:

1. Rào chắn đặt đâu cũng được; và dùng trong trường hợp nào cũng được. Không như mìn chỉ dùng để chống đổ bộ, rào chắn sẽ hữu dụng cả ở khi combat với tàu gunship (trừ tàu penspam, tất nhiên).  
2. Khi gặp đổ bộ, rào chắn làm trễ thời gian REA của bạn bị hư hại, cho phép các hệ thống quan trọng của bạn có thể hoạt động bình thường trong một khoảng thời gian. Điều này đặc biệt quan trọng khi bạn gặp các tàu đổ bộ crew số lượng lớn, thường thì khi đó năng lượng của tàu bạn sẽ giảm xuống 0 trong tích tắc nếu không có rào chắn. Có rào chắn nghĩa là tàu bạn vẫn hoạt động được trong khoảng thời gian mà crew đổ bộ của bạn chưa kịp triển khai phòng thủ.  
3. Rào chắn mạnh có thể giúp bạn làm khó AI săn crew của các tàu chơi AI laser săn crew.

Có nhiều tham số khác ảnh hưởng đến lựa chọn giữa mìn và rào chắn, như layout, meta, crew của bạn. Trong hình trên, FREA ở khá xa crew phòng thủ và do đó nó được đặt mìn. Đó là một ví dụ.

##### Cài đặt AI

Phần này chỉ ra một số AI có thể nói là hữu dụng và phổ biến nhất để phòng thủ đổ bộ.

###### *AI sử dụng kỹ năng*

Hãy so sánh (A) và (B) dưới đây. Chỉ một sự khác biệt nhỏ, nhưng ảnh hưởng triệt để đến hiệu quả của skill của crew.

1. Phòng mục tiêu có crew địch: Sử dụng kỹ năng  
2. Không: Sử dụng kỹ năng

Sử dụng (A), crew sẽ không sử dụng kỹ năng chừng nào nó và crew đối phương đang nhắm đến CÙNG MỘT phòng. Nghĩa là nếu chúng gặp nhau trong cùng một phòng trên đường đi đến hai room khác nhau thì skill sẽ không được sử dụng. Trong khi đó khi sử dụng (B), crew sẽ sử dụng skill bất cứ khi nào có thể.

![PSS guide illustration 45](/guide-images/image45.png)

Các crew mang skill đóngbăng cần dùng AI (A), nếu sử dụng (B), chúng sẽ đóng băng crew đối phương ngay khi gặp mặt. Nếu crew đối phương không có ý định đi đến cùng một phòng mục tiêu với chúng thì crew phòng thủ sẽ không thể đánh tay được, và thời gian đóng băng sẽ trôi qua vô nghĩa.

![PSS guide illustration 46](/guide-images/image46.png)

Trái lại, các crew mang skill tử quyền hay khí gas sẽ sử dụng (B) để hạ crew đổ bộ ngay khi gặp mặt.

###### *AI tìm diệt đổ bộ*

Sử dụng dòng AI sau (dòng 3 trong hình), để khiến crew phòng thủ chạy tới phòng mà quân đổ bộ đang nhắm đến.

Phòng thân thiện có crew đổ bộ: Chọn phòng thỏa mãn điều kiện

![PSS guide illustration 47](/guide-images/image47.png)

Bạn cần có nghiên cứu Python 3 để sử dụng được các AI phát hiện quân đổ bộ. Nếu chưa có thì sử dụng AI sau nhưng tốc độ phản ứng sẽ chậm hơn một chút, bởi crew sẽ chỉ đi phòng thủ sau khi rào chắn đã vỡ và HP phòng đã bắt đầu hụt:

1. Lò phản ứng HP \< 100%: chọn chòng điều kiện  
2. Pháo phòng không HP \< 100%: chọn phòng điều kiện

...

Các crew chạy sửa có thể đặt cài đặt độ nhạy HP phòng ở mức 50% hoặc thấp hơn, như thế crew phòng thủ sẽ chạy đi phòng thủ, trước khi crew chạy sửa chạy đi sửa, rất hữu dụng.

###### *Đối phó Galactic Archemis*

GA là một crew không dễđối phó (xem bài viết [Nhà giả kim thiên hà](http://27.73.126.49/crew/1245/galactic-alchemist-nha-gia-kim-thien-ha/)). Một GA với điểm ABI cao sẽ có thời gian gây cháy dài, và không những thế khiến ngọn lửa có sát thương cao ngất ngưởng, đủ để one-shot bất cứ crew máu giấy nào, cũng như giúp GA hồi máu trụ lại được bất cứ nguồn dmg nào không đủ cao để one-shot nó.

Để phòng thủ trước GA, về cơ bản, bạn cần có crew:

* có chỉ số kháng lửa cao để đối kháng, kháng trên 100% để sống được trên lửa, và kháng trên 120% để sống dc trên lửa \+ atk của GA.  
* hoặc có skill sửa chữa tức thời để dập lửa  
* hoặc có HP \+ ATK thật cao để đập chết được GA trước  
* có càng nhiều điều kiện trên càng tốt, trên cùng một crew, hoặc chia sẻ trên một đội crew

AI của crew sửa chữa có thể để như dưới đây:

`Phòng mục tiêu bị cháy: Sử dụng kỹ năng`

Trong một số trường hợp, đối phương sẽ gây cháy tàu bạn theo nhiều cách khác nhau ngoài GA, để làm rối AI sửa chữa. Bạn nên đặt dòng sau lên trên dòng AI sửa chữa để đối phó ngược lại:

`Phòng mục tiêu không có crew địch: Không được sử dụng kỹ năng`

Nếu bạn chưa có Python 3, sử dụng dòng sau để thay thế, sẽ không hiệu quả bằng nhưng sẽ ổn ở mức rank của bạn:

`Phòng mục tiêu HP > 0: Không được sử dụng kỹ năng`

###### *Tàng hình*

Tàng hình có thể làm rối loạn AI của rusher của những tàu sử dụng cơ chế rush chớp tắt liên tục, bên cạnh đó giới hạn số lượng quân có thể đổ bộ lên tàu bạn cùng lúc trong trường hợp đối đầu với những tàu đổ quân số lượng lớn.

Bạn cần có một hoặc hai crew rush 100% và phòng choàng tàng hình (Cloak Generator). Sử dụng AI sau:

`Phòng thân thiện có quân đổ bộ: Sử dụng kỹ năng`

Ngay khi crew đầu tiên cập tàu bạn, choàng tàng hình sẽ được kích hoạt và ngắt chuối đổ quân của tàu địch (trong trường hợp gặp rush chớp tắt). Trong trường hợp gặp phải đổ quân số lượng lớn, bạn có thể hạn chế số lượng quân cập lên tàu bạn cùng lúc, và điều tiết dần dần bằng cách cloak liên tục nhiều lần.

###### *EMP*

EM có thể vô hiệu hóa TLP của địch, và điều đó có thể đạt được thông qua một số cách:

1. Tên lửa EMP: được bắn từ phòng MSL hoặc từ máy bay Corsair, các tên lửa EMP rẻ, đơn giản và hữu dụng. Điểm yếu của chúng là cần thời gian dài để có thể đến được mục tiêu, và có khả năng bị né bởi động cơ.  
2. Pháo EMP: vũ khí EMP mạnh nhất tàu, nếu được buff đủ, nó có thể khiến 3 (thậm chí là 4\) hệ thống trên tàu địch bị EMP tại một thời điểm.  
3. Gửi đổ bộ có kỹ nang thụ động Hack/EMP: bạn có thể sử dụng crew rush để gửi lập tức một crew có kỹ năng thụ động là Hack/EMP (từ collection, như Ardent hay Soda) tới TLP của tàu địch với hi vọng vô hiệu hóa được nó.  
4. PP: nếu tàu địch không có khiên thì PP hoạt động như một khẩu EMP nhỏ. Tuy vậy EMP chỉ nên coi như là một bonus phụ thêm, không nên dựa dẫm quá nhiều, bởi nó có thời gian hiệu ứng khá ngắn.  
5. PD: tốt hơn PP, nhưng bạn vẫn không nên dựa dẫm vào khả năng EMP của nó.

## Cẩm nang build crew

chờ viết

# Các vấn đề khác {#các-vấn-đề-khác}

## Cẩm nang các loại vũ khí tầm xa {#cẩm-nang-các-loại-vũ-khí-tầm-xa}

PSS tất nhiên là phức tạp hơn game Tank 1990, hai tàu bắn nhau không phải cứ dính đạn là tụt HP, mà chuyện thực tế phức tạp hơn nhiều. Có hàng tá các loại súng khác nhau và có khi mỗi súng lại có cả tá loại đạn. Mỗi loại đạn lại gây ra một hiệu ứng khác nhau cho tàu.

### Các nhóm vũ khí tầm xa {#các-nhóm-vũ-khí-tầm-xa}

Vũ khí tầm xa ở đây được định nghĩa là các đối tượng có thể gây tổn hại lên thứ gì đó, mà không cần tiếp xúc. Radar và cloak không gây sát thương, còn cửa bảo vệ và droid thì cần tiếp xúc, vì vậy chúng sẽ không được liệt kê trong bài viết này.

#### Phân nhóm theo tính chất sát thương

Một vũ khí có thể gây ra một hay nhiều loại tổn hại (sát thương) khác nhau. Bài viết này nói về vũ khí, vì vậy nó sẽ không đi quá chi tiết vào các sát thương, nhưng hiểu về loại sát thương cũng là một phần quan trọng để hiểu vũ khí. Gom nhóm của các loại sát thương là như sau:

* Sát thương hệ thống: sát thương theo hit lên phòng và module trong phòng mục tiêu. Nôm na là làm cho phòng bị vỡ. Bị giảm bởi giáp của phòng. Một khi phòng bị phá hủy, sát thương hệ thống sẽ chuyển thành sát thương thân tàu.  
* Sát thương thủy thủ: sát thương theo hit lên tất cả các crew trong phòng mục tiêu. Không bị giảm bởi giáp.  
* Sát thương khiên: sát thương theo hit lên khiên năng lượng của tàu. Tất nhiên không bị giảm bởi giáp.  
* Sát thương xuyên giáp (Armor Piecing – gọi tắt là AP): gây sát thương hệ thống theo hit lên phòng mục tiêu, nhưng không bị giảm bởi giáp của phòng, và ngược lại cũng không chuyển hóa thành sát thương thân tàu sau khi phòng bị phá hủy.  
* Sát thương lửa: lửa làm cháy phòng và gây sát thương theo thời gian lên hệ thống cùng lúc với sát thương crew. Sát thương từ lửa bị giảm bởi giáp, tuy vậy nó không chuyển thành sát thương thân tàu sau khi phòng bị phá hủy. Lửa cũng có một hiệu ứng đặc biệt là khiến cho crew buộc phải dập lửa trước rồi mới sửa phòng. Và thời gian dập lửa thì có thể được giảm nếu crew được hỗ trợ bởi module vòi cứu hỏa có trong phòng.  
* Nhiễu điện từ trường (EMP): debuff theo thời gian, khiến cho phòng không hoạt động được. Phòng tiêu thụ điện không nạp điện được, phòng năng lượng không xả điện được, mìn bị vô hiệu hóa, và vòi cứu hỏa thì không hoạt động. Khi hết thời gian EMP thì các phòng và module sẽ hoạt động lại bình thường (tuy vậy mìn sẽ không tiếp tục phát nổ cho dù trước đó nó có bị trigger, và vòi thì không thể giúp dập được những ngọn lửa bùng lên trong lúc nó đang EMP). EMP bị ngắt khi hết thời gian hoặc phòng bị phá hủy.  
* Sát thương trực tiếp thân tàu (Direct Hull Damage – DHD): trừ trực tiếp HP của thân tàu. Bị giảm bởi giáp.

#### Phân nhóm theo hình thức đầu đạn

Các vũ khí cũng được phân nhóm dựa theo hình thức đầu đạn của chúng, mà tựu chung được phân thành hai nhóm:

* Đạn laser: chỉ các loại đạn năng lượng, đặc điểm của loại đạn này là không có đầu đạn và do đó không thể bị né, nhưng chúng có thể bị cản lại bởi khiên năng lượng của tàu  
* Đạn có đầu đạn (missile): chỉ các loại đạn vật lý, nôm na là tàu bạn ném “hòn” gì đó sang tàu địch, như tất cả các loại tên lửa, hay rocket của súng phóng lựu, hay đầu đạn của máy bay Hỏa ưng. Đặc điểm của đạn có đầu đạn là chúng bay xuyên qua khiên năng lượng, nhưng ngược lại chúng có thể bị né bởi Động cơ của tàu.

#### Phân nhóm theo nhóm phòng AI

Cuối cùng, các phòng vũ khí được cơ chế AI của trò chơi gom nhóm thành các nhóm như sau:

* Súng lazer: là loại vũ khí đông đảo nhất trong trò chơi, chỉ các vũ khí bắn đạn năng lượng, trừ Pháo phòng không và các Đại pháo  
* Phòng bắn tên lửa: chỉ các phòng bắn ra tên lửa, có nhiều loại tên lửa với cấu trúc gây sát thương khác nhau. Tên lửa là một loại đầu đạn và vì thế nó có thể bị né.  
* Pháo phòng không: chỉ có một loại phòng duy nhất, và cũng bắn laser, nhưng bởi tầm quan trọng nhạy cảm trong chiến thuật, nó được AI xếp vào một nhóm riêng  
* Súng thần công (Đại pháo): bao gồm Pháo EMP và Pháo ION, một khẩu là vũ khí vô hiệu hóa/phòng thủ, và khẩu còn lại là vũ khí tấn công. Cả hai đều là vũ khí năng lượng và đều là những vũ khí mạnh mẽ và nhạy cảm trong chiến thuật.  
* Phòng chứa máy bay: có thể thả nhiều loại máy bay với cấu trúc sát thương khác nhau.

Phần còn lại của bài sẽ đi vào chi tiết cấu trúc sát thương của từng loại vũ khí trong các nhóm. Thông số được lấy tại thời điểm tàu lvl 11 và tất cả các phòng cũng như nghiên cứu đều đã đạt cấp tối đa.

### Vũ khí laser {#vũ-khí-laser}

Nhóm vũ khí lazer nói về các vũ khí bắn đạn năng lượng (không có đầu đạn). Chúng có cấu trúc sát thương đa dạng và biểu đồ dưới đây chỉ mô tả DPS nói chung của chúng. HAN Def nói đến máy bay defender – được cho vào để tham chiếu, lưu ý rằng có thể có tối đa 5 máy bay hoạt động.

![PSS guide illustration 48](/guide-images/image48.png)

#### Lazer khai thác khoáng (MLZ)

![PSS guide illustration 49](/guide-images/image49.png)

Không có gì nhiều để nói, vũ khí bạn có từ đầu game, DPS ổn định, có mức HP vừa phải, gây ra những loại sát thương đa dụng. Nó không quá mạnh, nhưng luôn đáng tin tưởng.

MLZ được buff bởi chỉ số vũ khí.

![PSS guide illustration 50](/guide-images/image50.png)

#### Bolter (BT) – Tiểu liên (TL)

![PSS guide illustration 51](/guide-images/image51.png)

BT có sát thương ổn so với mức năng lượng mà chúng dùng. Tuy nhiên nhược điểm ở HP quá thấp khiến chúng dễ dàng trở thành mục tiêu để đối thủ xuyên thủng tàu của bạn. Phần lớn người chơi sẽ loại bỏ dần sự phụ thuộc vào BT từ lvl 7 và thay bằng những phòng 2×2 khác an toàn hơn, như PP/MG hay pháo K.

Botter được buff bởi chỉ số vũ khí.

![PSS guide illustration 52](/guide-images/image52.png)

#### Pháo K (KB/KP)

![PSS guide illustration 53](/guide-images/image53.png)

Pháo K được mua bằng dove hay bux. Chúng là sự thay thế tốt cho BT với DPS thấp hơn một chút nhưng bù lại có 2HP và đạn được bắn thành 3 voley.

Pháo K được buff bởi chỉ số vũ khí.

![PSS guide illustration 54](/guide-images/image54.png)

#### Bệ vũ khí cỡ nhỏ (SWP)

![PSS guide illustration 55](/guide-images/image55.png)

Đây là một bệ súng 2×2 mà bạn có thể triển khai một trong 3 loại súng lên đó, bao gồm Đại liên, Súng quang tử, và Súng diệt sinh.

##### Minigun – Đại liên (MG)

![PSS guide illustration 56](/guide-images/image56.png)

MG có lối bắn đặc biệt. Nó bắn liên tục (voley) từ 50-140 phát đạn, với delay 0.25ms, khiến phòng mục tiêu ở trạng thái chịu sát thương liên tục trong 25-37s và buộc crew địch phải liên tục ở trong đó để sửa. Giam 2-3 crew địch đồng nghĩa với 1/10 lượng crew tối đa của tàu đối phương, trong nửa phút, quá rẻ so cho chỉ 2 năng lượng. Tuy vậy MG phá khiên rất yếu do tính chất không dứt điểm của nó, nếu hệ thống súng còn lại của bạn không đủ mạnh để phá khiên thì MG sẽ không bắn hiệu quả được.

MG cần nạp đạn để bắn, và nó được buff bởi chỉ số vũ khí.

![PSS guide illustration 57](/guide-images/image57.png)

##### Súng quang tử (PP)

![PSS guide illustration 58](/guide-images/image58.png)

PP là vũ khí chuyên dụng để phá khiên. Trong trường hợp đối thủ không còn khiên, PP bắn trúng phòng mục tiêu sẽ gây EMP 1s cùng với một ít sát thương hệ thống.

Bạn cần PP nếu thường xuyên bị khiên của đối thủ làm khó dễ. PP cần nạp đạn để bắn. Và nó được buff bởi chỉ số khoa học chứ không phải WP như ở các phòng súng laser khác.

![PSS guide illustration 59](/guide-images/image59.png)

##### Sterilizer – Súng Diệt sinh (ST)

![PSS guide illustration 60](/guide-images/image60.png)

ST yêu cầu tàu level 11, và là vũ khí tối thượng chuyên trị crew. Nó tuyệt đối không gây bất kỳ sát thương nào khác ngoài sát thương crew. ST cần được sử dụng cẩn thận để không bắn vào khiên của đối phương. Nó cần nạp đạn, và được buff bởi chỉ số vũ khí.

![PSS guide illustration 61](/guide-images/image61.png)

#### Pháo Plasma (PLA)

![PSS guide illustration 62](/guide-images/image62.png)

Vũ khí chuyên dụng để diệt crew, và là sự thay thế hoàn hảo cho tiểu liên. Cần nạp gas để bắn, và được buff bởi chỉ số vũ khí.

![PSS guide illustration 63](/guide-images/image63.png)

#### Bệ vũ khí cỡ trung

![PSS guide illustration 64](/guide-images/image64.png)

Đây là một bệ súng 3×2 mà bạn có thể triển khai một trong ba loại súng là Pháo Laser, Railgun, và Pháo Quang tử.

##### Pháo Laser (LB)

![PSS guide illustration 65](/guide-images/image65.png)

LB giống như một phiên bản nâng cấp của MLZ, tiêu thụ nhiều năng lượng hơn đồng nghĩa với bền hơn, và sức sát thương cao hơn. Nó đòi hỏi phải nạp đạn, và được buff bởi chỉ sỗ vũ khí. Đây là vũ khí cho sát thương thân tàu cao nhất trong số các loại vũ khí cỡ trung.

![PSS guide illustration 66](/guide-images/image66.png)

##### Railgun

![PSS guide illustration 67](/guide-images/image67.png)

Railgun có thời gian nạp khá dài, tuy vậy với 2 sát thương AP, nó bắn rất thấm trên khía cạnh phá hủy phòng mục tiêu, đồng nghĩa với nó có thể phá hủy hầu hết room 2×2 quan trọng chỉ với một phát bắn và tạo điều kiện để các súng khác trên tàu bạn gây sát thương thân tàu ngay sau đó. Bạn sẽ thích Railgun tại endgame khi mà hầu hết đối thủ của bạn đều là người từng trải và đều có khả năng bọc giáp rất kỹ cho những phòng ít HP.

Rail gun cần nạp đạn để bắn và được buff bởi chỉ số vũ khí.

![PSS guide illustration 68](/guide-images/image68.png)

##### Pháo Quang tử (PD)

![PSS guide illustration 69](/guide-images/image69.png)

Tương tự như PP nhưng với mức sát thương khiên thậm chí còn cao hơn. Đây là vũ tối thượng để chuyên trị khiên.

PD có voley 4, nó cần nạp đạn. Tất cả các vũ khí photon đều được buff bởi chỉ số khoa học, và PD cũng thế.

![PSS guide illustration 70](/guide-images/image70.png)

### Tên lửa {#tên-lửa}

Các phòng bắn tên lửa bắn ra tên lửa, phòng bắn tạo nên tốc độ bắn, nhưng đầu đạn tên lửa thì định hình nên cấu trúc sát thương. Tất cả các tên lửa đều là đầu đạn, nghĩa là chúng có đặc tính bắn xuyên qua khiên, nhưng ngược lại chúng có khả năng bị né bởi Engine.

#### Các bệ phóng tên lửa

![PSS guide illustration 71](/guide-images/image71.png)MSL![PSS guide illustration 72](/guide-images/image72.png)MML

Có hai loại bệ phóng tên lửa trong trò chơi. Phòng phóng tên lửa (MSL) là phòng cơ bản và bạn có thể có tối đa 2 cái. Trong khi đó phòng phóng nhiều tên lửa (MML) là phòng mua bằng dove hoặc bux và bạn chỉ được phép có tối đa 1\. MML chỉ có 1HP và bạn chỉ nên sử dụng khi bạn có khả năng phòng thủ tốt cho nó.

Phòng tên lửa định hình nên số lượng tên lửa mà nó có thể chứa, cũng như tốc độ phóng tên lửa, trong khi đó đầu tên lửa định hình nên cấu trúc sát thương.

#### Các loại đầu tên lửa

##### Rocket

![PSS guide illustration 73](/guide-images/image73.png)

Rocket là tên lửa cơ bản, nó gây cả sát thương crew lẫn sát thương hệ thống. Nếu được nghiên cứu đầy đủ, nó có thể được bắn theo volley 3, tốn kém hơn nhưng gây nhiều sát thương hơn.

##### Javerlin/Hỏa giáo

![PSS guide illustration 74](/guide-images/image74.png)

Đầu đạn chuyên trị gây sát thương AP, bỏ qua giáp phòng và phá hủy phòng mục tiêu.

##### Jungle

![PSS guide illustration 75](/guide-images/image75.png)

Đầu đạn chuyên trị crew, bạn có thể sẽ muốn tìm cách đặt AI tìm và diệt crew để sử dụng đầu đạn này.

##### Penetrator/Tên lửa xuyên phá

![PSS guide illustration 76](/guide-images/image76.png)

Đầu đạn gây sát thương trực tiếp lên thân tàu (HDH).

##### EMP

![PSS guide illustration 77](/guide-images/image77.png)

Đầu đạn gây hiệu ứng EMP.

##### Scalet

![PSS guide illustration 78](/guide-images/image78.png)

Đầu đạn gây sát thương thông qua việc gây cháy phòng mục tiêu.

Cấu trúc sát thương của các loại đầu đạn trên như sau:

![PSS guide illustration 79](/guide-images/image79.png)

### Đại pháo {#đại-pháo}

Đại pháo là các phòng bắn đạn năng lượng. Chúng đắt cả về diện tích lẫn nang lượng, nhưng nguy hiểm và đóng vai trò quan trọng trong chiến thuật. Bạn sẽ phải tìm hiểu rất nhiều về AI target và AI quản lý năng lượng để có thể thuần phục được những khẩu súng đắt đỏ này.

#### Pháo EMP (EMP)

![PSS guide illustration 80](/guide-images/image80.png)

Đúng như tên gọi, pháo EMP gây EMP, tuy là pháo nhưng nó thật ra có tác dụng vô hiệu hóa/phòng thủ, và được coi là vũ khí phòng thủ quan trọng thứ 2 trên tàu, sau khiên. EMP khiến phòng tục tiêu mất chức năng trong một thời gian dài, gây một ít sát thương hệ thống, sát thương thân tàu, và sát thương khiên không đáng kể. Ngoài ra không cần nói gì nhiều hơn.

EMP được buff bởi chỉ số vũ khí và nó cần nạp đạn.

![PSS guide illustration 81](/guide-images/image81.png)

#### Pháo ION

![PSS guide illustration 82](/guide-images/image82.png)

Khẩu thần công của tàu, niềm kiêu hãnh của tàu lvl 11\. Đắt đỏ (nó cần nạp Ion core để bắn, và khá tốn gas) và sát thương cao ngất ngưởng. Tuy vậy nó cũng ngốn năng lượng ở mức tương xứng và bạn sẽ muốn có crew rush 100% để có thể đặt pháo ION ở mức 1 năng lượng. Cũng như sẽ phải phân phối năng lượng hợp lý khi hết rush.

ION bắn voley 11 phát đạn liên tục, và nó được buff bởi chỉ số vũ khí.

![PSS guide illustration 83](/guide-images/image83.png)

### Máy bay {#máy-bay}

![PSS guide illustration 84](/guide-images/image84.png)

Hangar

![PSS guide illustration 85](/guide-images/image85.png)

Turkey Hanger

Máy bay được phóng bởi các phòng hangar – hầm phóng máy bay. Có hai hangar trong game – phòng Hangar (HAN) có sẵn và phòng Turkey Hanger (TUR) được bán qua daily sales.

Phòng TUR chiếm ít diện tích hơn, tốn ít năng lượng hơn, nhưng đổi lại thời gian reload lâu hơn, chứa được ít máy bay hơn, cũng như chỉ sản xuất được một loại máy bay duy nhất. Trong khi đó HAN có thể sản xuất nhiều loại máy bay khác nhau phục vụ đa dạng chiến thuật.

Về khía cạnh chiến đấu, các loại máy bay khác nhau ở tốc độ bay, loại hình đầu đạn, loại hình sát thương và sát thương. Trong đó khác biệt rõ rệt nhất là ở máy bay phòng cơ và các loại máy bay còn lại, do Phòng cơ có tốc độ bắn cũng như tốc độ bay chậm đáng kể, và ngược lại có HP cao hơn đáng kể so với các loại còn lại.

#### Interceptor – Tiêm kích đánh chặn

![PSS guide illustration 86](/guide-images/image86.png)

Interceptor

Là loại máy bay đầu tiên mà bạn có thể unlock được. Tiêm kích là loại máy bay có tốc độ cao. Sát thương tuy nhỏ nhưng tần suất bắn rất lớn cộng với khả năng tiếp cận tàu địch nhanh chóng giúp tiêm kích có thể gây ra một lượng sát thương đáng gờm. Điểm yếu của tiêm kích là HP thấp khiến chúng không thích hợp để tấn công các tàu được trang bị kỹ vũ khí phòng không.

#### Stinger – Do thám

![PSS guide illustration 87](/guide-images/image87.png)

Stinger

Là loại máy bay rẻ nhất. Stinger không có gì đáng nói quá nhiều. Chúng có tốc độ cao nhưng không có ưu việt so với tiêm kích, DPS không cao. Chúng thậm chí còn không làm được nhiệm vụ bait – rút của tàu địch 4 năng lượng từ pháo phòng không đối phương, do HP quá giấy. Không đáng để sử dụng khi so sánh với chi phí về thời gian xây, chỗ chứa, và reload time của Hangar.

#### Defender – Phòng cơ

![PSS guide illustration 88](/guide-images/image88.png)

Defender

Trái với stinger, máy bay defender có HP cao, tuy tốc độ bắn chậm nhưng được bù lại bởi sát thương mỗi phát đạn lớn, khiến chúng duy trì được một lượng sát thương đáng tin cậy. Bởi vậy mà không như tiêm kích, defender có thể dùng trong mọi trường hợp, kể cả khi tàu địch có pháo phòng không. Nhược điểm của defender nằm ở tốc độ bay chậm, chiếm nhiều sức chứa của Hangar, và thời gian xây lâu.

#### Firehawk – Hỏa Ưng

![PSS guide illustration 89](/guide-images/image89.png)

Firehawk

Điểm đặc biệt của Hỏa Ưng nằm ở loại sát thương của chúng. Thứ nhất, khác với các máy bay khác, Hỏa Ưng phóng đầu đạn. Điều này có nghĩa là đạn của Hỏa Ưng bay xuyên khiên, nhưng trái lại có thể bị né bởi Engine. Thứ hai, đạn của Hỏa Ưng chỉ gây sát thương cháy. Điều này có nghĩa là nó không trực tiếp gây sát thương thân tàu nhưng ngược lại có thể hỗ trợ các vũ khí khác gây sát thương thân tàu, bằng cách ép crew đối phương phải dập lửa trước tiên.

## Danh sách các phòng mở rộng {#danh-sách-các-phòng-mở-rộng}

Các phòng dưới đây không có sẵn trong kho cung ứng (store) của game mà chỉ được bán bằng bux qua shop hằng ngày; bằng dove qua shop dove; hay bằng quà thưởng khi nạp. Chúng có thể là một phần quan trọng trên tàu, hoặc không, có thể là một phần trong lối chơi, hoặc không. Và chúng ảnh hưởng đến kế hoạch sử dụng bux, dove, và kế hoạch tham gia mùa giải (tour) để lấy dove của bạn.

Lưu ý, danh sách dưới đây không đảm bảo đầy đủ, một số phòng có chức năng tương đương với những phòng được liệt kê ở đây, không còn được bán nữa, hay không có được bán sẽ không được liệt kê.

### Phòng droid mở rộng {#phòng-droid-mở-rộng}

![PSS guide illustration 90](/guide-images/image90.png)

Visiri Mechbay (VM, 2×2) – một phòng Android đa nhiệm, tương đương AS level 6 nhưng dùng ít năng lượng hơn.

![PSS guide illustration 91](/guide-images/image91.png)

Zongzi Factory (ZF, 2×2) – chỉ sản xuấtZongzi Droid (lai giữa droid phòng thủ và sửa chữa)

![PSS guide illustration 92](/guide-images/image92.png)

Ghostly Factory (GF, 2×2) – chỉ sản xuất Ghostly Holo Droids (droid phòng thủ)

### Phòng bed mở rộng {#phòng-bed-mở-rộng}

Có tổng cộng 9 bed phụ, giúp mở rộng 10 crew. Có một bed không bán daily sale, hai bed rất ít khi bán, và các bed còn lại bán thường xuyên hơn, từ 4-6 tháng một lần.

![PSS guide illustration 93](/guide-images/image93.png)

Dog House (DH, 2×2) – nhà chó, chỉ bán kèm theo gói hỗ trợ muộn($45 trên trang chủ)

![PSS guide illustration 94](/guide-images/image94.png)

Aquarium (AQU, 2×3) – bể cá, nhà của con mực, phòng bed mở rộng duy nhất có thể up level và chứa được 2 crew. Bán trong shop dove và rất ít khi bán qua daily sale.

![PSS guide illustration 95](/guide-images/image95.png)

Captain’s Quarters (CAP, 3×2) – phòng riêng của thuyền trưởng

![PSS guide illustration 96](/guide-images/image96.png)

XMas Tree (XMA, 2×2) – cây Noel

![PSS guide illustration 97](/guide-images/image97.png)

Graveyard (GRA, 2×2) – mộ

![PSS guide illustration 98](/guide-images/image98.png)

Cat House (CAT, 2×2) – nhà cho mèo, nhà của Meowy, con linh vật của trang này

![PSS guide illustration 99](/guide-images/image99.png)Oven (OVE, 2×2) – lò nướng, nhà của gà Turkey

![PSS guide illustration 100](/guide-images/image100.png)Cryopod / Zakian Cryopod (CP / ZCP, 2×2) – bán qua shop dove và rất ít khi bán qua daily sale

![PSS guide illustration 101](/guide-images/image101.png)

Car Garage (CAR, 2×2) – nhà để xe

### Nhà để máy bay (hangar) mở rộng {#nhà-để-máy-bay-(hangar)-mở-rộng}

![PSS guide illustration 102](/guide-images/image102.png)

Turkey Hangar (TUR, 2×2) – sản xuất Turkey Craft, đồ mong ước của các tàu chơi Hangar.

### Phòng luyện tập mở rộng {#phòng-luyện-tập-mở-rộng}

![PSS guide illustration 103](/guide-images/image103.png)

Galaxy Gym (GYM, 3×2) – Phòng tập Gym Ngân Hà, tương đương một phòng Gym level 9, nhưng train được cùng lúc 3 crew

![PSS guide illustration 104](/guide-images/image104.png)

Lunar College (LUN, 2×2) – Học viện Ánh Trăng Tương đương một học viện level 9, có thể train cùng lúc 2 crew

### Phòng bảo vệ mở rộng {#phòng-bảo-vệ-mở-rộng}

![PSS guide illustration 105](/guide-images/image105.png)

Disintegrator Gate (DG, 2×2)

![PSS guide illustration 106](/guide-images/image106.png)

Small Gas Trap (-, 1×2)

### Phòng y tế mở rộng {#phòng-y-tế-mở-rộng}

![PSS guide illustration 107](/guide-images/image107.png)

Toilet (WC, 2×2) – WC

![PSS guide illustration 108](/guide-images/image108.png)

Flower Gardens(FG, 3×2) – vườn hoa

### Lò phản ứng mở rộng {#lò-phản-ứng-mở-rộng}

![PSS guide illustration 109](/guide-images/image109.png)

Coal Reactor (CR, 2×2) – Lò phản ứng chạy bằng than, có thể nâng cấp lên level 2, cấp được 2 năng lượng

### Phòng AI mở rộng {#phòng-ai-mở-rộng}

![PSS guide illustration 110](/guide-images/image110.png)

Computer Room (COM, 2×2) – Phòng máy tính, cho phép lưu 25 dòng AI, nhiều hơn CMD level 7 nhưng ít hơn CMD level 8, và tiết kiệm được 2 ô diện tích tàu

### Nhà kho mở rộng {#nhà-kho-mở-rộng}

![PSS guide illustration 111](/guide-images/image111.png)

Workshop (WOR, 2×2) – Xưởng, sức chứa 150\. Có thể cập nhật tới level 2 để có sức chứa 400

### Động cơ (Engines) mở rộng {#động-cơ-(engines)-mở-rộng}

![PSS guide illustration 112](/guide-images/image112.png)

Fusion Drive Engine (FDE, 3×2) – tương đương một động cơ level 6, chỉ có thể nhận được thông qua gói hỗ trợ muộn mua trên website.

### Phòng vũ khí mở rộng {#phòng-vũ-khí-mở-rộng}

![PSS guide illustration 113](/guide-images/image113.png)

Pháo K, bắn đạn tương tự như Bolter/Tiểu liên, không mạnh hơn tiểu liên bao nhiêu, đổi lại tiêu thụ nhiều năng lượng hơn và nhờ thế khắc phục điểm yếu của TL là HP thấp. Được bán với giá 100 dove tại shop dove.

![PSS guide illustration 114](/guide-images/image114.png)

Multi Missile Launcher (MML, 3×2) – Phòng bắn nhiều tên lửa. Bắn y chang phòng MSL nhưng chứa được ít tên lửa hơn, và chỉ tiêu tốn một năng lượng, khiến tàu xuất hiện thêm môt điểm yếu dễ bị công phá. Được bán với giá 100 dove, và là món hàng ưa thích của các tàu chơi penspam.

![PSS guide illustration 115](/guide-images/image115.png)

Particle Discharger (PAD, 3×2), được gọi tắt là Phraser, một vũ khí gần tương tự MLZ. Chỉ có thể nhận được khi mua gói hỗ trợ muộn. Sát thương không ổn định.

### Máy khai thác khoáng mở rộng {#máy-khai-thác-khoáng-mở-rộng}

Liệt kê cho đủ chứ mấy phòng dưới đây nói chung là lừa người thôi.

![PSS guide illustration 116](/guide-images/image116.png)

Prototype Mining Drill (MIN, 2×3)

![PSS guide illustration 117](/guide-images/image117.png)

Prototype Gas Extractor (GAS, 2×3)

### Một số skin {#một-số-skin}

Có khá nhiều skin, và số lượng của chúng đang tăng dần theo thời gian, sau mỗi mùa giải, nên mệt quá không kể hết được. Nhưng đại loại thì skin trông như sau:

![PSS guide illustration 118](/guide-images/image118.png)

Love Quarter Apply – Phòng tình yêu, skin của phòng CAP.

![PSS guide illustration 119](/guide-images/image119.png)

Velvet Sanctuary (LOV) – Phòng gấm, skin của phòng CAP.

## Tên tiếng Việt của các crew {#tên-tiếng-việt-của-các-crew}

Nguồn ban đầu từ tài nguyên của bác King Na. Có cập nhật một vài crew mới có gần đây (không dám chắc là đầy đủ).

Danh sách này cần thiết khi bạn gặp khó khăn khi nhập danh sách crew của mình vào [https://pixel-prestige.com/prestige-calculator.php](https://pixel-prestige.com/prestige-calculator.php)

### 1 sao {#1-sao}

| ‘Saucy Maguire’ | N/A |
| :---- | :---- |
| Alex | N/A |
| Awful Alex | Alex Ăn Bám |
| Bonnie Blacktooth | Bonnie Cà Bông |
| Burt the Terrible | Burt Gặm Bút |
| Cheng the Red | Trịnh Si Tình |
| Collins | N/A |
| Cross-eyed Mary | Mary Mắt Lé |
| Deadeye Diana | Diana “Mắt Ó” |
| Female Citizen | Nữ Công Dân |
| Fixer Silvertoungue | Fixer Lưỡi Bạc |
| Handsome Michael | Michael “đập zai” |
| Hulk | N/A |
| Infected Trey | Trey nhiễm khuẩn |
| Infected Victoria | Victoria nhiễm khuẩn |
| Jacob-57a | N/A |
| Jake | N/A |
| Katie-8 ‘Hammerhead’ | Katie-8 ‘Đầu Búa’ |
| Kevin Kruel | N/A |
| Kevin | N/A |
| Larry | N/A |
| Leela | N/A |
| Lin | Linh |
| Mabel Mayhem | N/A |
| Male Civilian | Nam dân sự |
| Michelle | N/A |
| Monica | N/A |
| Peter | N/A |
| Sally Smelter | Lan Luyện Kim |
| Serial25-Bookworm | Mã Số 25 – Mọt Sách |
| Skully | Trẩu Tre |
| Tina | N/A |
| Tom no.3 | N/A |
| Tran | Trần |
| Vit the idiot | Vit Ngáo Đá |
| Whats-his-name | Méo-Có-Tên |

| 2 sao | … |
| :---- | :---- |
| Abu | N/A |
| Ardent Stardancer | Xạ Thủ Ardent |
| Big Football Fan | Fan Bóng đá |
| Cammy | N/A |
| Candy | Chị Kẹo |
| Chigs | N/A |
| Da Qiao | Đại Kiều |
| Gong Fu Girl | Nữ Công Phu |
| Grey Conductor | Chỉ Huy Grey |
| Jane | N/A |
| Jemima | N/A |
| Kent | N/A |
| Linda | N/A |
| Mary | N/A |
| Mikael Monnier | N/A |
| Monk | Thầy Tu |
| Oren Marcus | N/A |
| Private Brian | Hạ Sĩ Brian |
| Rob | N/A |
| Sarah | N/A  |
| Xiao Qiao | Tiểu Kiều |

### 3 sao {#3-sao}

| Alien McAlienface | Ngoại tinh Mặt bựa |
| :---- | :---- |
| Arctic Pole Boy | Cậu Bắc Cực |
| Ardent Starhuntress | Nữ Xạ Thủ Ardent |
| Astronaut | Phi Hành Gia |
| Captain Mack Swallow | Thuyền trưởng Mack Swallow |
| Cara | Cara |
| Cat Boy | Miêu Tử |
| Christian | N/A |
| David | N/A |
| Dennis | N/A |
| Dr Mew | Tiến sĩ Meo Meo |
| Evil General | Ác Tướng |
| Fed Medic | Y tá Liên bang |
| First Mate | Đồng Chí Nhất |
| Gentleman | Đầu Đinh |
| Good Student | SViên Giỏi |
| Grey Virtuoso | N/A |
| Helen | N/A |
| Jessica | N/A |
| Jesus | Chúa Giêsu |
| King Salamander | Vua |
| Male Nurse | Y tá nam |
| Mama | Má |
| Messiah | Đấng Mê-si |
| Miss McAlienface | Nữ Ngoại tinh Mặt bựa |
| Mr Egggg | Trứng Humpty  |
| Nolan | N/A |
| Office Exec | Giám Đốc |
| Omar |  Ông Bà Má |
| Paul | N/A |
| Professor | Giáo Sư |
| Qtarian Healer | Y tá Qtari |
| Red Ninja | Ninja Đỏ |
| Ribi | N/A |
| Robyna Hoots | N/A |
| Schrodinger | N/A |
| Serge Eric | Sĩ Quan Eric |
| Simon | N/A |
| Tiffany | N/A |
| Verunus | N/A |
| Visiri Capt’n | Thuyền Trưởng Visiri |
| Vivien | N/A |
| Zombiee | Nữ Xác |
| Zombie | Xác Sống |

### 4 sao {#4-sao}

| Aaron | N/A |
| :---- | :---- |
| Abbie | Xuân (Abbie) |
| Agay | N/A |
| Steamy Aleks | Aleks ướt át |
| Ardent Templar | Chiến Binh Ardent |
| Asssassin Alien | Sát nhân Ngoại tinh |
| Bad Uncle | Lão Xấu |
| Bad Vlad | Vlad Bi đát |
| Barot | N/A |
| Cao Cao | Tào Tháo |
| Demon Boy | Ác Tử |
| Dong Zhuo | Đổng Trác |
| Dr Sera | Tiến Sĩ Sera |
| Easter Bunny | Thỏ Phục Sinh |
| Elf | Nữ Tinh |
| Ennui | N/A |
| Eric | N/A |
| Foxy Girl | Hồ Ly |
| Geeky Vincent | Vin Ngố |
| Giant Slime | Slime Khổng Lồ |
| Golden Boy | Cậu Vàng |
| Golden Troop | CSGT |
| Government Troop | Lính chính phủ |
| Henry | N/A |
| Huge Hellaloya | N/A |
| Keira | N/A |
| Kingpin | Đỗ Nam Xìtrum  |
| Le Vincent | Vin Ngầu |
| Liu Bei | Lưu Bị |
| Mad Jackson | Jackson Một Mắt |
| Masky Lia | N/A |
| McDonald | Mác Đô |
| Medusa | N/A |
| Mistycball | Linh Cầu Mistycball |
| Monkey King | Tôn Ngộ Không |
| Mr Alan | Anh Alan |
| Mr Cray | Anh Cray |
| Mr Old | Ông Già |
| Mr She | N/A |
| Ninja | N/A |
| Orc | N/A |
| Ponytail Alien | Ngoại Tinh Tóc Ngựa |
| Ron | N/A |
| Sakura | Hoa Anh Đào |
| Server Eric | Eric – Máy chủ |
| Sie | C |
| Stevo | N/A |
| Stove Tops | Stevie Chóp |
| Teddy | Gấu Bông |
| Tin Man | Người Thiếc |
| TJ | N/A |
| Tripod | Tam Guốc |
| Walking Skeleton | Xương Sống |
| Witch | Phù Thủy |
| Zhang Fei | Trương Phi |
| Zhao Yun | Triệu Vân |
| Zhuge Liang | Gia Cát Lượng |

### 5 sao {#5-sao}

| Admiral Serena | Đô Đốc Serena |
| :---- | :---- |
| Alpaco | Lạc Đà |
| Ancestral Spirit | Linh hồn tổ tiên |
| Angel | Thiên Thần |
| Bogan | Sói Xỉn |
| Brenda Linuxer | N/A  |
| Cancer | Cự Giải |
| Ethan | N/A |
| Gemini | Song Tử |
| Green Ranger | Oliver – Oliver – Siêu Nhân Rau Xanh |
| Guan Yu | Quan Vũ |
| Huntress | Nữ Thợ Săn |
| Invader | Quân Xâm Lược |
| Jaiden | Zai Đen |
| Leo | Sư Tử |
| Leon Mars | N/A |
| Libra | Thiên Bình |
| Lollita | N/A |
| Lyu Bu | Lữ Bố |
| Maya | N/A |
| Mecha | N/A |
| Menga Linuxer | N/A |
| Miss Jane | Hoa Hậu Jane |
| Mr Coconut | Sọ Dừa |
| Roborob | N/A |
| Rocky | Thạch Nhân |
| Ryzen | N/A |
| Sagita | Nhân Mã |
| Scorpio | Bò Cạp |
| Taura | Kim Ngưu  |
| Thomas | N/A |
| Virgo | Xử Nữ  |
| Visiri Alchemist | Nhà giả kim Visiri |
| Xin | N/A |
| Yusi | N/A |
| Zongzi-Man | Người bánh tro |

### 6 sao {#6-sao}

| Alley Cat Zombie | Thây Ma Meo Meo |
| :---- | :---- |
| Angry Squid | Mực Điên |
| Area51 Alien | Vũ Trụ Nhân A51 |
| Bio Android | Người máy Sinh học |
| Bling Captain | Thuyền trưởng Hào nhoáng |
| Blingy Captain | Nữ Thuyền trưởng Hào Nhoáng |
| Bobby | N/A |
| Buns | Thỏ Bạch |
| Captain | Thuyền Trưởng |
| Cathulu | Quái Miêu |
| Chihuahua | Chó Phóc |
| D.R.A.G.O.N | R.Ồ.N.G.L.Ộ.N (D.R.A.G.O.N) |
| D.R.A.K.E | Đ.Ạ.I.L.O.N.G (D.R.A.K.E ) |
| Daft Kittus | Mèo Mun |
| Dark Matter Hero | Hắc Chất Nhân |
| Dark Matter Legend | Thần Hắc Chất |
| Dark Matter Mechi | Robo Hắc Chất |
| Doge | Chóe |
| Dolores | N/A |
| Dr Dong | BS. Đông |
| Draconian Mecha | Robo Draconian |
| Drakian Clone | Nhân bản Drakia |
| Drakian | Người Draki |
| Drogon | N/A |
| Edward | N/A |
| Engineer Bob | Kĩ Sư Bob |
| Faerie Dragon | Rồng Tiên |
| Fed Bobby | Bobby Liên bang |
| Fed Laura | Laura Liên bang |
| Fed Lisa | Lisa Liên bang |
| Fed Michelle | Michelle Liên bang |
| Fed Peter | Peter Liên bang |
| Fed Tony | Tony Liên bang |
| Franky | N/A |
| Froggy | Ếch Ré |
| Giant Chicken | Gà Khổng |
| Grandpa | Lão Già |
| Hydra | N/A |
| Infected Drakian Clone | Nhân Bản Draki bị nhiễm khuẩn |
| Infected Drakian | Chiến Binh Draki bị nhiễm khuẩn |
| King Ellie | Vua Voi |
| KS Gray | Xám Nhân loại K |
| Laura | N/A |
| Lionheart | Sư Tâm |
| Lisa | N/A |
| Maizi | N/A |
| Meowy Cat | Meo Meo |
| Michelle | N/A |
| Miss Santa | Bà Già Nô-en |
| Mousey | Chuột Nhắt |
| Mr Blue | Cậu Xanh |
| Mr Horse | Anh Mã |
| Mummy | Xác Ướp |
| Nova | N/A |
| Old Driver | Tài Xế Già |
| Ophiuchus | Xà Phu |
| P.A.N.D.A | G.Ấ.U.T.R.Ú.C |
| Phoenix | Phượng hoàng |
| Pirate Alex | Tặc trưởng Alex |
| Pirate Edward | Tặc trưởng Edward |
| Pirate Lia | Tặc trưởng Lia  |
| Pirate Loretta | Tặc trưởng Lorreta |
| Pirate Michelle | Tặc trưởng Michelle |
| Pirate Tony | Tặc trưởng Tony |
| Polar Bear | Gấu Bắc  |
| Qtarian Bobby | Bobby Qtari |
| Qtarian Edward | Edward Qtari |
| Qtarian Laura | Laura Qtari |
| Qtarian Lisa | Lisa Qtari |
| Qtarian Michelle | Michelle Qtari |
| Qtarian Tony | Tony Qtari |
| Roach | Gián |
| Robo Santa | Ông máy Nô-en |
| Robot | N/A |
| Saint Patrick | Thánh Patty |
| Santa’s Helper | Chú lùn Noel |
| Santa’s Helpstress | Cô lùn Noel |
| Soda Delivery Guy | Thần Tốc SSoda |
| Sparko | N/A |
| Sphinx | Nhân Sư |
| Squid | Mực Xanh |
| Tin Robot | Robo Thiếc |
| Tony | N/A |
| Transport Driver | Người Vận Chuyển |
| Turkey Man | Gà Tây |
| Whaler | Whaler  |
| Wolfy | Sói con |
| Zakian Assassin | Sát thủ Zaki |
| Zakian | Người Zaki |

7 sao

| Alien Queen | Chúa Ngoại Tinh |
| :---- | :---- |
| Dracorpse | N/A |
| Eva | N/A |
| King Dong | Vua Trym |
| Lilith | N/A |
| Paralympic God | Thánh Liệt Chi |
| Pinkzilla | Hồng Long |
| Professor Brenda | Giáo Sư Brenda |
| Reaper | Tử Thần |
| SCV | N/A |
| Silver Paladin | Hiệp Sĩ Bạc |
| Willy | N/A |

## Layout tàu mẫu {#layout-tàu-mẫu}

### Tàu mẫu level 5 {#tàu-mẫu-level-5}

#### Federation

![PSS guide illustration 120](/guide-images/image120.png)![PSS guide illustration 121](/guide-images/image121.png)

#### Qtarian

![PSS guide illustration 122](/guide-images/image122.png)

#### Pirate

![PSS guide illustration 123](/guide-images/image123.png)

### [Tàu](http://27.73.126.49/ship/760/tau-mau-level-6/) mẫu level 6 {#tàu-mẫu-level-6}

#### Federation

![PSS guide illustration 124](/guide-images/image124.png)

#### Qtarian

![PSS guide illustration 125](/guide-images/image125.png)![PSS guide illustration 126](/guide-images/image126.png)

#### Pirate

![PSS guide illustration 127](/guide-images/image127.png)

### Tàu mẫu level 7 {#tàu-mẫu-level-7}

#### Federation

![PSS guide illustration 128](/guide-images/image128.png)Teleporter / Droid spammer![PSS guide illustration 129](/guide-images/image129.png)Teleporter![PSS guide illustration 130](/guide-images/image130.png)Teleporter![PSS guide illustration 131](/guide-images/image131.png)Teleporter

#### Qtarian

![PSS guide illustration 132](/guide-images/image132.png)Teleporter / Droid spammer![PSS guide illustration 133](/guide-images/image133.png)Teleporter / Droid spammer

#### Pirate

![PSS guide illustration 134](/guide-images/image134.png)Teleporter/Droid spammer![PSS guide illustration 135](/guide-images/image135.png)Droid spammer![PSS guide illustration 136](/guide-images/image136.png)Droid spammer![PSS guide illustration 137](/guide-images/image137.png)Droid spammer

### Tàu mẫu lv8+ {#tàu-mẫu-lv8+}

Tới lúc này rồi thì tự đứng trên đôi chân mình đi bro 🙂

### Liên kết hay {#liên-kết-hay}

Cập nhật lần cuối: 2021/01/08

* Danh sách tàu trong trò chơi, cần thiết để ngắm cho đã, tạo động lực: [http://www.pixyship.com/ships](http://www.pixyship.com/ships) hoặc [http://pixel-prestige.com/ship-list.php](http://pixel-prestige.com/ship-list.php)

* Một danh sách thiết kế tàu mẫu đủ loại lvl, khá tốt để có một layout mẫu không quá tệ mà có thể dựa vào đó để chỉnh sửa lại cho phù hợp với tàu mình: [http://pixel-prestige.com/ship-gallery.php](http://pixel-prestige.com/ship-gallery.php)

* Công cụ thiết kế tàu, vô cùng quan trọng để thiết kế tàu và đem đi review chỉnh sửa: [http://www.pixyship.com/builder](http://www.pixyship.com/builder)

* Điều tra thiết kế tàu của bất kỳ ai, thậm chí có thể import vào công cụ thiết kế tàu để thiết kế tiếp: [http://www.pixyship.com/players](http://www.pixyship.com/players)

* Một công cụ thiết kế tàu khác, điểm đặc biệt là có thể lưu lại thiết kế vào tài khoản của mình để xem lại và chỉnh sửa về sau, có thể import thiết kế từ pixiship về: [http://pixel-prestige.com/ship-builder.php](http://pixel-prestige.com/ship-builder.php)

* Bảng xếp hạng crew theo từng role, rất cần thiết để lên kế hoạch build dàn crew phù hợp với chiến thuật và điều kiện kinh tế: [http://pixel-prestige.com/crew-list.php](http://pixel-prestige.com/crew-list.php)

* Danh sách stats của crew, dễ xem hơn danh sách trên nhưng thiếu phần đánh giá xếp hạng theo role: [http://www.pixyship.com/crew](http://www.pixyship.com/crew)

* Công cụ lên kế hoạch ghép crew, vô cùng quan trọng để lên kế hoạch chuẩn bị crew để ghép dần: [http://pixel-prestige.com/prestige-calculator.php](http://pixel-prestige.com/prestige-calculator.php)

* Danh sách item trong trò chơi, bao gồm cả thông tin “giá chợ”, rất cần thiết để không bị mua hớ cũng như để tính giá tối đa mang được lên chợ khi bán item: [http://www.pixyship.com/items](http://www.pixyship.com/items), hoặc [http://pixel-prestige.com/item-list.php](http://pixel-prestige.com/item-list.php)

* Danh sách phòng trong trò chơi, rất cần thiết để tra thông tin các phòng, tra xem game có tổng bao nhiêu loại bed, bao nhiêu loại droid…: [http://www.pixyship.com/rooms](http://www.pixyship.com/rooms) hoặc [http://pixel-prestige.com/room-list.php](http://pixel-prestige.com/room-list.php)

* Danh sách nghiên cứu trong trò chơi: [http://www.pixyship.com/research](http://www.pixyship.com/research) hoặc [http://pixel-prestige.com/research-list.php](http://pixel-prestige.com/research-list.php)

* Các công thức cơ bản: [http://pixelstarships.fandom.com/wiki/Formulas](http://pixelstarships.fandom.com/wiki/Formulas)

### Galaxy Map {#galaxy-map}

![PSS guide illustration 138](/guide-images/image138.png)
