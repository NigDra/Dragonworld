package edu.eci.DragonWorld;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import edu.eci.DragonWorld.model.Player;
import edu.eci.DragonWorld.model.Room;
import edu.eci.DragonWorld.services.ServicesDragon;

@Controller
public class ControllerStomp {
    @Autowired
    private ServicesDragon servicesDragon;

    @Autowired
    SimpMessagingTemplate msgt;

    @MessageMapping("/newPlayer.{numRoom}")
    public void handlePlayerEvent(Player player, @DestinationVariable Integer numRoom) throws Exception {
        // Al crear un nuevo jugador, verificar que no exista alguno con el mismo
        servicesDragon.addPlayerToRoom(player, numRoom);
        try {
            if (servicesDragon.getRooms().get(numRoom).getPlayers().size() >= 1) {
                // String playersJson = servicesDragon.getRooms().get(numRoom).playersJson();
                System.out.println("comida al iniciar");
                System.out.println(servicesDragon.getRooms().get(numRoom).getFoods());
                msgt.convertAndSend("/topic/createFood." + numRoom, servicesDragon.getRooms().get(numRoom).foodsJson());
                msgt.convertAndSend("/topic/newGame." + numRoom, servicesDragon.getRooms().get(numRoom).playersJson());
            }
        } catch (Exception e) {
            // Block of code to handle errors
        }
    }

    @MessageMapping("/newRoom")
    public void handleRoomEvent(Room roomObj) throws Exception {
        int numRoom = roomObj.getNum();
        if (!servicesDragon.getRooms().containsKey(numRoom)) {
            // System.out.println("Nueva sala!:");
            // Al crear un nuevo jugador, verificar que no exista alguno con el mismo
            // System.out.println("--------------------------numero de sala: " +
            // roomObj.getNum());
            servicesDragon.addNewRoom(roomObj);
            System.out.println("crear nuvep room");

        }

    }

    @MessageMapping("/movePlayer.{numRoom}")
    public void handlePlayerMoveEvent(Player player, @DestinationVariable Integer numRoom) throws Exception {
        servicesDragon.moveDragon(player, numRoom);
        msgt.convertAndSend("/topic/movePlayer." + numRoom, servicesDragon.getRooms().get(numRoom).playersJson());
    }

    @MessageMapping("/disconnect.{numRoom}")
    public void handlePlayerDisconnectEvent(Player player, @DestinationVariable Integer numRoom) throws Exception {
        System.out.println("antes ----- " + servicesDragon.getRooms().get(numRoom).playersJson());
        String jugadoreErase = servicesDragon.getRooms().get(numRoom).playerJson(player);
        String jugadorBorrado = servicesDragon.deletePlayerOfRoom(player, numRoom);
        System.out.println("depues ----- " + servicesDragon.getRooms().get(numRoom).playersJson());
        System.out.println(jugadoreErase);
        msgt.convertAndSend("/topic/deletePlayer." + numRoom, jugadoreErase);
    }

    @MessageMapping("/eat/{numRoom}/food.{numFood}")
    public void handlePlayerEatEvent(Player player, @DestinationVariable Integer numRoom,
            @DestinationVariable Integer numFood) throws Exception {
        servicesDragon.eat(player, numFood, numRoom);
        System.out.println("ENTRO A COMIDAa------------------" + numFood + "player" + player.getNickName());
        msgt.convertAndSend("/topic/eat." + numRoom, servicesDragon.getRooms().get(numRoom).foodsJson());
    }

    @MessageMapping("/ataca/{numRoom}")
    public void handlePlayerAtacEvent(Player player, @DestinationVariable Integer numRoom) throws Exception {
        String a = "{\"nickName\":\"" + player.getNickName() + "\"}";
        msgt.convertAndSend("/topic/ataca." + numRoom, a);
    }

}