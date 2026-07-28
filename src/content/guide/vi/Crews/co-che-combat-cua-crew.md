---
title: "Cơ chế combat của crew"
order: 8
level: "beginner"
---

## Cơ chế hoạt động của đổ bộ và giao tranh chống đổ bộ {#cơ-chế-hoạt-động-của-đổ-bộ-và-giao-tranh-chống-đổ-bộ}

Đổ bộ nói đến việc crew của tàu chúng ta thông qua cửa dịch chuyển đặt trong phòng TLP để dịch chuyển vào một phòng chỉ định trên tàu địch, kích hoạt khả năng tấn công phòng và crew của tàu địch. Thông qua đó làm trục trặc khả năng hoạt động của tàu địch, làm giảm áp lực mà tàu địch gây lên tàu của bạn và tạo điều kiện để các vũ khí trên tàu của bạn tạo ra sát thương lên thân tàu nhằm dẫn tới chiến thắng.

Đổ bộ có thể coi là một trong những chiến thuật nguy hiểm nhất trong PSS. Vậy nên có kể hoạch chống đổ bộ cũng là một phần việc mà bạn phải để tâm đến. Bài viết này làm rõ các cơ chế của trò chơi xoay quanh đổ bộ và combat chống đổ bộ, nhằm làm tiền đề trước khi đi vào AI đổ bộ và chống đổ bộ.

### Cơ chế combat của crew {#cơ-chế-combat-của-crew}

#### Slot phòng

Chúng ta biết là mỗi phòng có một số lượng giới hạn crew có thể đứng buff. Chúng ta gọi mỗi vị trí đứng là một slot, và số lượng crew có thể đứng buff là số slot. Trong bài viết này chúng ta đặt tên là A, B, C… theo thứ tự về thâm niên.

![PSS guide illustration 19](/guide-images/vi/co-che-combat-cua-crew.png)A, B, C

Mỗi phòng có hai bộ slot A/B/C cho mỗi phe. Tức là một phòng 2×3 có thể chứa được 6 crew – bao gồm 3 phe mình và 3 phe địch. Bộ A, B, C dành cho crew của bạn thì xếp theo thứ tự từ trái sang phải, còn bộ dành cho crew phe địch thì từ phải sang trái nghĩa là C’, B’, A’. Điều này giúp tạo nên quang cảnh hai crew đứng ở hai phía và chíu chíu nhau như bạn thường thấy khi pvp.

![PSS guide illustration 20](/guide-images/vi/co-che-combat-cua-crew-2.png)A và A’

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
